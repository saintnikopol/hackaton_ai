import { useState, useRef, useEffect, useId } from "react";

export enum TranscriptionStatus {
  INITIAL_STATUS = "Click “Start” and allow microphone access.",
  CONNECTING = "Requesting microphone access & connecting to server…",
  SENDING_CONFIGURATION = "Connected! Sending configuration…",
  ACTIVE = "🎤 Recording… speak now!",
  SERVER_BUSY = "Server busy. Please wait…",
  SERVER_ERROR = "Server error!",
  CONNECTION_CLOSED = "Connection closed",
  MICROPHONE_ACCESS_DENIED = "Microphone access denied",
}

export interface WhisperMessageSegment {
  text: string;
  completed: boolean;
}

export interface WhisperMessage {
  uid: string;
  status?: string;
  message?: string | number;
  language?: string;
  segments?: Array<WhisperMessageSegment>;
}

export interface UseTranscribeSpeechProps {
  onNewTranscriptionSegment: (newSegment: WhisperMessageSegment) => void;
}

export function useTranscribeSpeech({
  onNewTranscriptionSegment,
}: UseTranscribeSpeechProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [status, setStatus] = useState<TranscriptionStatus>(
    TranscriptionStatus.INITIAL_STATUS,
  );

  const audioId = useId(); // stable UID for this hook instance
  const isCapturingRef = useRef(false);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, []);

  async function startCapture() {
    if (isCapturingRef.current) return;

    setIsCapturing(true);
    isCapturingRef.current = true;

    // request microphone access
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;
      setStatus(TranscriptionStatus.CONNECTING);
    } catch (err) {
      console.error("Microphone access denied:", err);
      setStatus(TranscriptionStatus.MICROPHONE_ACCESS_DENIED);
      setIsCapturing(false);
      isCapturingRef.current = false;
      return;
    }

    // connect to websocket
    // TODO: Change wsUrl
    const wsUrl = "ws://localhost:9090";
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      setStatus(TranscriptionStatus.SENDING_CONFIGURATION);
      const config = {
        uid: audioId,
        language: "en",
        task: "transcribe",
        model: "tiny",
        use_vad: true,
      };
      ws.send(JSON.stringify(config));
    };

    ws.onmessage = (ev) => {
      try {
        const msg: WhisperMessage = JSON.parse(ev.data);
        handleServerMessage(msg);
      } catch (e) {
        console.error("Invalid JSON from server:", e);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setStatus(TranscriptionStatus.SERVER_ERROR);
      // We keep “isCapturingRef” true until stopCapture() is called
    };

    ws.onclose = () => {
      setStatus(TranscriptionStatus.CONNECTION_CLOSED);
      stopCapture();
    };

    // set up audio processing → resample → send PCM
    setupAudioProcessing();
  }

  function stopCapture() {
    // 1) Mark capturing false
    isCapturingRef.current = false;
    setIsCapturing(false);

    // 2) Disconnect processor & audio context
    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch {}
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }

    // 3) Stop all microphone tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    // 4) Close WebSocket
    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch {}
      socketRef.current = null;
    }

    setStatus(TranscriptionStatus.INITIAL_STATUS);
  }

  function handleServerMessage(msg: WhisperMessage) {
    // 1) Ignore messages for other UIDs
    if (msg.uid !== audioId) return;

    // 2) Handle WAIT / ERROR / SERVER_READY / DISCONNECT / language / segments
    if (msg.status === "WAIT") {
      const waitMins =
        typeof msg.message === "number" ? Math.round(msg.message) : "";
      setStatus(TranscriptionStatus.SERVER_BUSY);
      console.warn(`Server busy. Estimated wait: ${waitMins} minutes`);
      stopCapture();
      return;
    }

    if (msg.status === "ERROR") {
      setStatus(TranscriptionStatus.SERVER_ERROR);
      console.error("Server error message:", msg.message);
      return;
    }

    if (msg.message === "SERVER_READY") {
      setStatus(TranscriptionStatus.ACTIVE);
      // At this point, the server is ready to receive PCM chunks
      return;
    }

    if (msg.message === "DISCONNECT") {
      setStatus(TranscriptionStatus.CONNECTION_CLOSED);
      stopCapture();
      return;
    }

    if (msg.language) {
      // Sometimes the server will send back a detected language
      setStatus(
        `🎤 Recording… (Detected: ${msg.language})` as unknown as TranscriptionStatus,
      );
      return;
    }

    if (msg.segments && msg.segments.length > 0) {
      console.log(msg);
      console.log("segment to pass", msg.segments[msg.segments.length - 1]);
      onNewTranscriptionSegment(msg.segments[msg.segments.length - 1]);
    }
  }

  function setupAudioProcessing() {
    if (!mediaStreamRef.current) return;

    // 1) Create an AudioContext at 16 kHz
    const audioCtx = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioCtx;

    // 2) Create a MediaStreamSource from the mic
    const sourceNode = audioCtx.createMediaStreamSource(mediaStreamRef.current);

    // 3) Create a ScriptProcessorNode to grab PCM from the mic
    const processorNode = audioCtx.createScriptProcessor(4096, 1, 1);
    processorRef.current = processorNode;

    processorNode.onaudioprocess = (event) => {
      // Only send audio if we’re still capturing AND the socket is OPEN
      if (
        !isCapturingRef.current ||
        !socketRef.current ||
        socketRef.current.readyState !== WebSocket.OPEN
      ) {
        return;
      }

      // Grab the Float32 PCM from the mic
      const inputData = event.inputBuffer.getChannelData(0);
      // Resample it to 16kHz if needed (we created the AudioContext at 16kHz, but just in case)
      const resampled = resampleTo16kHz(inputData, audioCtx.sampleRate);
      // Send the ArrayBuffer directly
      socketRef.current.send(resampled.buffer);
    };

    // 4) Hook up the nodes
    sourceNode.connect(processorNode);
    processorNode.connect(audioCtx.destination);
  }

  function resampleTo16kHz(
    audioData: Float32Array,
    originalSampleRate: number,
  ): Float32Array {
    if (originalSampleRate === 16000) {
      return new Float32Array(audioData);
    }

    // Linear-interpolation resampling
    const data = new Float32Array(audioData);
    const targetLength = Math.round(data.length * (16000 / originalSampleRate));
    const resampledData = new Float32Array(targetLength);
    const springFactor = (data.length - 1) / (targetLength - 1);

    resampledData[0] = data[0];
    if (targetLength > 1) {
      resampledData[targetLength - 1] = data[data.length - 1];
    }
    for (let i = 1; i < targetLength - 1; i++) {
      const idx = i * springFactor;
      const left = Math.floor(idx);
      const right = Math.ceil(idx);
      const frac = idx - left;
      resampledData[i] = data[left] + (data[right] - data[left]) * frac;
    }

    return resampledData;
  }

  return {
    isCapturing,
    status,
    startCapture,
    stopCapture,
  };
}

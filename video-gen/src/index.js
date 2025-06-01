import { fal } from "@fal-ai/client";
import dotenv from 'dotenv';
import express from 'express';


dotenv.config();

const port = process.env.PORT || 3000;
const key = process.env.FAL_KEY;
const videoTemplate = 'https://fal.media/files/kangaroo/vUfCLHyM0RYpusebYzLV-_output.mp4';

fal.config({ credentials: key });

const app = express();
app.use(express.json());

const cors = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Max-Age', '3600');
  }
  next();
};

app.use(cors);

async function generateSpeech(req) {
  const { text } = req.body;
  console.log("Generating speech for text:", text);

  const result = await fal.subscribe("fal-ai/minimax/speech-02-turbo", {
    input: {
      text,
      voice_setting: {
        speed: 1.22,
        vol: 1,
        voice_id: "Wise_Woman",
        pitch: 0,
        english_normalization: false
      },
      output_format: "url"
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        update.logs.map((log) => log.message).forEach(l => {
          if (l) console.log(l);
        });
      }
    },
  });

  console.log("Speech generation completed!");
  console.log("Audio URL:", result.data.audio.url);
  console.log("Duration:", result.data.duration_ms);
  console.log("Request ID:", result.requestId);

  return { audioUrl: result.data.audio.url, durationMs: result.data.duration_ms, id: result.requestId }
}

async function generateVideo(req) {
  const { video, audio } = req.body;
  console.log("Generating video for video URL:", video);
  console.log("Audio URL:", audio);

  const result = await fal.subscribe("veed/lipsync", {
    input: {
      video_url: video,
      audio_url: audio
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        update.logs.map((log) => log.message).forEach(l => {
          if (l) console.log(l);
        });
      }
    },
  });

  const { url, file_name: fileName, file_size: fileSize } = result?.data?.video;
  const reqId = result?.requestId;

  console.log("Video generation completed!");
  console.log("Url:", url);
  console.log("File Name:", fileName);
  console.log("File Size:", fileSize);
  console.log("Request ID:", reqId);

  return { url, fileName, fileSize, reqId }
}

app.get('/', (req, res) => {
  res.send('Welcome to the API. Use GET / for health. Use POST /audiogen OR /videogen OR /audiovideogen with the correct payload');
});

app.get('/health', (req, res) => {
  res.status(200).json({ response: "OK" });
});

app.post('/audiogen', async function(req, res) {
  try {
    if (!req.body.text) {
      res.status(400).send({ error: 'Text is required' });
    }
    const result = await generateSpeech(req);
    res.send(result);
  } catch (error) {
    console.error("Error generating speech:", error);
    res.status(500).send({ error: 'Failed to generate speech' });
  }
});

app.post('/videogen', async function(req, res) {
  try {
    if (!req.body.video) {
      res.status(400).send({ error: 'Video is required' });
    }
    if (!req.body.audio) {
      res.status(400).send({ error: 'Audio is required' });
    }
    const result = await generateVideo(req);
    res.send(result);
  } catch (error) {
    console.error("Error generating video:", error);
    res.status(500).send({ error: 'Failed to generate video' });
  }
});

app.post('/audiovideogen', async function(req, res) {
  try {
    if (!req.body.text) {
      res.status(400).send({ error: 'Text is required' });
    }
    const speechResult = await generateSpeech(req);
    console.log('Step ONE completed!');
    const audioUrl = speechResult?.audioUrl;
    const videoReq = {
      body: {
        video: videoTemplate,
        audio: audioUrl
      }
    };
    const videoResult = await generateVideo(videoReq);
    console.log('Step TWO completed!');
    console.log('DONE!');
    res.send(videoResult);
  } catch (error) {
    console.error("Error generating video from text:", error);
    res.status(500).send({ error: 'Failed to generate video from text' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}. Open HOST_NAME:${port}/ for more details.`);
});

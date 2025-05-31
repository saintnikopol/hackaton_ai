import { fal } from "@fal-ai/client";
import dotenv from 'dotenv';


dotenv.config(); // Load environment variables from .env file

fal.config({
  credentials: process.env.FAL_KEY
});

async function generateSpeech() {
  try {
    console.log("Generating speech for text from .env...");

    const result = await fal.subscribe("fal-ai/minimax/speech-02-turbo", {
      input: {
        // text: "Hello World",
        text: process.env.TEXT,
        voice_setting: {
          speed: 1.17, vol: 1, voice_id: "Wise_Woman", pitch: 0, english_normalization: false
        },
        output_format: "url" // This will return a URL to the audio file
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    console.log("Speech generation completed!");
    console.log("Audio URL:", result.data.audio.url);
    console.log("Duration (ms):", result.data.duration_ms / 1000);
    console.log("Request ID:", result.requestId);

    return result;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
}

// Run the function
generateSpeech()
  .then(() => {
    console.log("Script completed successfully!");
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
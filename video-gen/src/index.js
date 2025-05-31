import { fal } from "@fal-ai/client";
import dotenv from 'dotenv';
import express from 'express';


dotenv.config(); // Load environment variables from .env file

const port = process.env.PORT || 3000;
const key = process.env.FAL_KEY;

fal.config({ credentials: key });

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the API. Use GET / for health. Use POST /generate with the payload {text:...}');
});

app.get('/health', (req, res) => {
  res.status(200).json({ response: "OK" });
});

app.post('/generate', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).send({ error: 'Text is required' });
    }
    console.log("Generating speech for text:", text);

    const result = await fal.subscribe("fal-ai/minimax/speech-02-turbo", {
      input: {
        text,
        voice_setting: {
          speed: 1.19,
          vol: 1,
          voice_id: "Wise_Woman",
          pitch: 0,
          english_normalization: false
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
    console.log("Duration:", result.data.duration_ms);
    console.log("Request ID:", result.requestId);

    res.send({ audioUrl: result.data.audio.url, durationMs: result.data.duration_ms, id: result.requestId });
  } catch (error) {
    console.error("Error generating speech:", error);
    res.status(500).send({ error: 'Failed to generate speech' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}. Open HOST_NAME:${port}/ for more details.`);
});

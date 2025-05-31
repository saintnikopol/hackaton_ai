( generated using https://r.jina.ai/ )

Title: MiniMax Speech-02 Turbo | Text to Speech | fal.ai

URL Source: https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api

Markdown Content:
### About

Convert text to speech using MiniMax Turbo API.

### 1. Calling the API[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#api-call-install)

### Install the client[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#api-call-install)

The client provides a convenient way to interact with the model API.

`npm install --save @fal-ai/client`

### Setup your API Key[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#api-call-setup)

Set `FAL_KEY` as an environment variable in your runtime.

`export FAL_KEY="YOUR_API_KEY"`

### Submit a request[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#api-call-submit-request)

The client API handles the API submit protocol. It will handle the request status updates and return the result when the request is completed.

```
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/minimax/speech-02-turbo", {
  input: {
    text: "Hello world! This is a test of the text-to-speech system."
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});
console.log(result.data);
console.log(result.requestId);
```

2. Authentication[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#auth)
-----------------------------------------------------------------------------------

The API uses an API Key for authentication. It is recommended you set the `FAL_KEY` environment variable in your runtime when possible.

### API Key[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#auth-api-key)

In case your app is running in an environment where you cannot set environment variables, you can set the API Key manually as a client configuration.

```
import { fal } from "@fal-ai/client";

fal.config({
  credentials: "YOUR_FAL_KEY"
});
```

3. Queue[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#queue)
---------------------------------------------------------------------------

### Submit a request[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#queue-submit)

The client API provides a convenient way to submit requests to the model.

```
import { fal } from "@fal-ai/client";

const { request_id } = await fal.queue.submit("fal-ai/minimax/speech-02-turbo", {
  input: {
    text: "Hello world! This is a test of the text-to-speech system."
  },
  webhookUrl: "https://optional.webhook.url/for/results",
});
```

### Fetch request status[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#queue-status)

You can fetch the status of a request to check if it is completed or still in progress.

```
import { fal } from "@fal-ai/client";

const status = await fal.queue.status("fal-ai/minimax/speech-02-turbo", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b",
  logs: true,
});
```

### Get the result[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#queue-result)

Once the request is completed, you can fetch the result. See the [Output Schema](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#schema-output) for the expected result format.

```
import { fal } from "@fal-ai/client";

const result = await fal.queue.result("fal-ai/minimax/speech-02-turbo", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b"
});
console.log(result.data);
console.log(result.requestId);
```

4. Files[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#files)
---------------------------------------------------------------------------

Some attributes in the API accept file URLs as input. Whenever that's the case you can pass your own URL or a Base64 data URI.

### Data URI (base64)[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#files-data-uri)

You can pass a Base64 data URI as a file input. The API will handle the file decoding for you. Keep in mind that for large files, this alternative although convenient can impact the request performance.

### Hosted files (URL)[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#files-from-url)

You can also pass your own URLs as long as they are publicly accessible. Be aware that some hosts might block cross-site requests, rate-limit, or consider the request as a bot.

### Uploading files[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#files-upload)

We provide a convenient file storage that allows you to upload files and use them in your requests. You can upload files using the client API and use the returned URL in your requests.

```
import { fal } from "@fal-ai/client";

const file = new File(["Hello, World!"], "hello.txt", { type: "text/plain" });
const url = await fal.storage.upload(file);
```

5. Schema[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#schema)
-----------------------------------------------------------------------------

### Input[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#schema-input)

`text``string`* required

Text to convert to speech (max 5000 characters)

`voice_setting``VoiceSetting`

Voice configuration settings Default value: `[object Object]`

`audio_setting``AudioSetting`

Audio configuration settings

`language_boost``LanguageBoostEnum`

Enhance recognition of specified languages and dialects

Possible enum values: `Chinese, Chinese,Yue, English, Arabic, Russian, Spanish, French, Portuguese, German, Turkish, Dutch, Ukrainian, Vietnamese, Indonesian, Japanese, Italian, Korean, Thai, Polish, Romanian, Greek, Czech, Finnish, Hindi, auto`

`output_format``OutputFormatEnum`

Format of the output content (non-streaming only) Default value: `"hex"`

Possible enum values: `url, hex`

`pronunciation_dict``PronunciationDict`

Custom pronunciation dictionary for text replacement

```
{
  "text": "Hello world! This is a test of the text-to-speech system.",
  "voice_setting": {
    "speed": 1,
    "vol": 1,
    "voice_id": "Wise_Woman",
    "pitch": 0,
    "english_normalization": false
  },
  "output_format": "hex"
}
```

### Output[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#schema-output)

`audio``File`* required

The generated audio file

`duration_ms``integer`* required

Duration of the audio in milliseconds

```
{
  "audio": {
    "url": "https://fal.media/files/kangaroo/kojPUCNZ9iUGFGMR-xb7h_speech.mp3"
  }
}
```

### Other types[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#schema-other)

#### TextToVideoRequest[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#type-TextToVideoRequest)

`prompt``string`* required

`prompt_optimizer``boolean`

Whether to use the model's prompt optimizer Default value: `true`

#### PronunciationDict[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#type-PronunciationDict)

`tone_list``list<string>`

List of pronunciation replacements in format ['text/(pronunciation)', ...]. For Chinese, tones are 1-5. Example: ['燕少飞/(yan4)(shao3)(fei1)']

#### ImageToVideoDirectorRequest[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#type-ImageToVideoDirectorRequest)

`prompt``string`* required

Text prompt for video generation. Camera movement instructions can be added using square brackets (e.g. [Pan left] or [Zoom in]). You can use up to 3 combined movements per prompt. Supported movements: Truck left/right, Pan left/right, Push in/Pull out, Pedestal up/down, Tilt up/down, Zoom in/out, Shake, Tracking shot, Static shot. For example: [Truck left, Pan right, Zoom in]. For a more detailed guide, refer [https://sixth-switch-2ac.notion.site/T2V-01-Director-Model-Tutorial-with-camera-movement-1886c20a98eb80f395b8e05291ad8645](https://sixth-switch-2ac.notion.site/T2V-01-Director-Model-Tutorial-with-camera-movement-1886c20a98eb80f395b8e05291ad8645)

`image_url``string`* required

URL of the image to use as the first frame

`prompt_optimizer``boolean`

Whether to use the model's prompt optimizer Default value: `true`

#### TextToVideoLiveRequest[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#type-TextToVideoLiveRequest)

`prompt``string`* required

`prompt_optimizer``boolean`

Whether to use the model's prompt optimizer Default value: `true`

#### File[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#type-File)

`url``string`* required

The URL where the file can be downloaded from.

`content_type``string`

The mime type of the file.

`file_name``string`

The name of the file. It will be auto-generated if not provided.

`file_size``integer`

The size of the file in bytes.

`file_data``string`

File data

#### ImageToVideoRequest[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#type-ImageToVideoRequest)

`prompt``string`* required

`image_url``string`* required

URL of the image to use as the first frame

`prompt_optimizer``boolean`

Whether to use the model's prompt optimizer Default value: `true`

#### TextToSpeechHDRequest[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#type-TextToSpeechHDRequest)

`text``string`* required

Text to convert to speech (max 5000 characters)

`voice_setting``VoiceSetting`

Voice configuration settings Default value: `[object Object]`

`audio_setting``AudioSetting`

Audio configuration settings

`language_boost``LanguageBoostEnum`

Enhance recognition of specified languages and dialects

Possible enum values: `Chinese, Chinese,Yue, English, Arabic, Russian, Spanish, French, Portuguese, German, Turkish, Dutch, Ukrainian, Vietnamese, Indonesian, Japanese, Italian, Korean, Thai, Polish, Romanian, Greek, Czech, Finnish, Hindi, auto`

`output_format``OutputFormatEnum`

Format of the output content (non-streaming only) Default value: `"hex"`

Possible enum values: `url, hex`

`pronunciation_dict``PronunciationDict`

Custom pronunciation dictionary for text replacement

#### SubjectReferenceRequest[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#type-SubjectReferenceRequest)

`prompt``string`* required

`subject_reference_image_url``string`* required

URL of the subject reference image to use for consistent subject appearance

`prompt_optimizer``boolean`

Whether to use the model's prompt optimizer Default value: `true`

#### AudioSetting[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#type-AudioSetting)

`sample_rate``SampleRateEnum`

Sample rate of generated audio Default value: `"32000"`

Possible enum values: `8000, 16000, 22050, 24000, 32000, 44100`

`bitrate``BitrateEnum`

Bitrate of generated audio Default value: `"128000"`

Possible enum values: `32000, 64000, 128000, 256000`

`format``FormatEnum`

Audio format Default value: `"mp3"`

Possible enum values: `mp3, pcm, flac`

`channel``ChannelEnum`

Number of audio channels (1=mono, 2=stereo) Default value: `"1"`

Possible enum values: `1, 2`

#### MiniMaxTextToImageWithReferenceRequest[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#type-MiniMaxTextToImageWithReferenceRequest)

`prompt``string`* required

Text prompt for image generation (max 1500 characters)

`image_url``string`* required

URL of the subject reference image to use for consistent character appearance

`aspect_ratio``AspectRatioEnum`

Aspect ratio of the generated image Default value: `"1:1"`

Possible enum values: `1:1, 16:9, 4:3, 3:2, 2:3, 3:4, 9:16, 21:9`

`num_images``integer`

Number of images to generate (1-9) Default value: `1`

`prompt_optimizer``boolean`

Whether to enable automatic prompt optimization

#### TextToVideoDirectorRequest[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#type-TextToVideoDirectorRequest)

`prompt``string`* required

Text prompt for video generation. Camera movement instructions can be added using square brackets (e.g. [Pan left] or [Zoom in]). You can use up to 3 combined movements per prompt. Supported movements: Truck left/right, Pan left/right, Push in/Pull out, Pedestal up/down, Tilt up/down, Zoom in/out, Shake, Tracking shot, Static shot. For example: [Truck left, Pan right, Zoom in]. For a more detailed guide, refer [https://sixth-switch-2ac.notion.site/T2V-01-Director-Model-Tutorial-with-camera-movement-1886c20a98eb80f395b8e05291ad8645](https://sixth-switch-2ac.notion.site/T2V-01-Director-Model-Tutorial-with-camera-movement-1886c20a98eb80f395b8e05291ad8645)

`prompt_optimizer``boolean`

Whether to use the model's prompt optimizer Default value: `true`

#### MiniMaxTextToImageRequest[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#type-MiniMaxTextToImageRequest)

`prompt``string`* required

Text prompt for image generation (max 1500 characters)

`aspect_ratio``AspectRatioEnum`

Aspect ratio of the generated image Default value: `"1:1"`

Possible enum values: `1:1, 16:9, 4:3, 3:2, 2:3, 3:4, 9:16, 21:9`

`num_images``integer`

Number of images to generate (1-9) Default value: `1`

`prompt_optimizer``boolean`

Whether to enable automatic prompt optimization

#### VoiceSetting[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#type-VoiceSetting)

`voice_id``string`

Predefined voice ID to use for synthesis Default value: `"Wise_Woman"`

`custom_voice_id``string`

Custom cloned voice ID. If provided, this will override the voice_id field.

`speed``float`

Speech speed (0.5-2.0) Default value: `1`

`vol``float`

Volume (0-10) Default value: `1`

`pitch``integer`

Voice pitch (-12 to 12)

`emotion``EmotionEnum`

Emotion of the generated speech

Possible enum values: `happy, sad, angry, fearful, disgusted, surprised, neutral`

`english_normalization``boolean`

Enables English text normalization to improve number reading performance, with a slight increase in latency

#### VoiceCloneRequest[#](https://fal.ai/models/fal-ai/minimax/speech-02-turbo/api#type-VoiceCloneRequest)

`audio_url``string`* required

URL of the input audio file for voice cloning. Should be at least 10 seconds long.

`noise_reduction``boolean`

Enable noise reduction for the cloned voice

`need_volume_normalization``boolean`

Enable volume normalization for the cloned voice

`accuracy``float`

Text validation accuracy threshold (0-1)

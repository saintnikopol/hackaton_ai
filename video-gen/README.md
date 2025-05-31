# Fal AI Text-to-Speech Server

This is a Node.js server that uses the Fal AI Text-to-Speech API to generate speech.

## Requirements

* Node.js (v20.15.0 or higher)
* npm (10.7.0 or higher)

## Installation

1. Clone this repository: `git clone ...`
2. Navigate to the project directory: `cd video-gen`
3. Install dependencies: `npm install`

## Usage

1. Create a `.env` ( based on `.env-example` ) file in the root of the project with your Fal AI API key: `FAL_KEY=YOUR_API_KEY`
2. Run the server: `npm start`

## Development

1. Run the server in development mode: `npm run dev`

## Run

1. Run the server in development mode: `npm run start`

## API endpoints

1. **GET /**: Welcome message
2. **GET /health**: Health check
3. **POST /generate**: Generate speech for given text ( passed as a payload like `{"text":...}` )

## Test and Sample Text

```sh
TEXT="My name is Miss Lancaster."; curl -X POST -H "Content-Type: application/json" -d '{"text":"'"${TEXT}"'"}' localhost:3000/generate
```

or

```sh
TEXT="Hi. You've made some progress today. You've made a mistake, however. You said: I saw an dog in the park. That's not correct, you should have said: I saw a dog in the park. Remember, always use A. when the word starts with a consonant."
# ...
```

The output should look something like the following snippet:

```json
{ "audioUrl": "https://fal.media/files/rabbit/ZjZg66JQZTsV4WIxYBsf-_speech.mp3", "durationMs": 936, "id": ".." }
```

## Contributing

Ask the devs!

## License

Ask the devs!

---

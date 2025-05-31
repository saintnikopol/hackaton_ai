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

## Dependencies

This project uses the following dependencies:

* `@fal-ai/client`: Fal AI client library
* `dotenv`: Environment variable management
* `express`: Web framework (not used in this example, but can be added)

## Output

The output should look something like the following snippet:

```
Generating speech for 'Hello World'...
Speech generation completed!
Audio URL: https://fal.media/files/rabbit/ZjZg66JQZTsV4WIxYBsf-_speech.mp3
Duration: 1296 ms
Request ID: f9179408-0cdb-45b1-9aa8-80de5e244d47
Script completed successfully!
```

## Contributing

Ask the devs!

---

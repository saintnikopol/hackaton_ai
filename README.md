# Lancaster

## Running the app

You would need to [install pnpm](https://pnpm.io/installation) first

### Electron client

1. Run `cd client; pnpm install; pnpm dev`

### Generate lesson feedback

1. Open third terminal and run `cd generate-lesson-text; pnpm install`
2. Run `cp ./.env-example ./.env`, you would need to replace the openai key there with the actual one
3. Run `pnpm dev`

### Video gen

1. Run `cd video-gen; npm install`
2. Run `cp ./.env-example ./.env`, you would need to replace the fal key there with the actual one
3. Run `npm run dev` to start the video gen service

### Whisper live

#### On MacOS M1 chips

1. Run `docker build -t whisperlive-cpu -f docker/Dockerfile.cpu .`
2. Run `docker run -it -p 9090:9090 whisperlive-cpu -d`

#### On other platforms

Check the instructions [here](https://github.com/collabora/WhisperLive?tab=readme-ov-file#whisper-live-server-in-docker)

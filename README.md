# docker-container-status-notifier

> 🐳⏰ Notifier for Docker container statuses

[![Docker Pulls](https://img.shields.io/docker/pulls/knutkirkhorn/docker-container-status-notifier)](https://hub.docker.com/r/knutkirkhorn/docker-container-status-notifier) [![Docker Image Size](https://badgen.net/docker/size/knutkirkhorn/docker-container-status-notifier)](https://hub.docker.com/r/knutkirkhorn/docker-container-status-notifier)

Notify for changes in Docker container statuses. Notify to a Discord channel using [Discord Webhooks](https://discordapp.com/developers/docs/resources/webhook).

<div align="center">
	<img src="https://raw.githubusercontent.com/knutkirkhorn/docker-container-status-notifier/main/media/top-image.png" alt="Container status notification example">
	<p>See <a href="https://github.com/knutkirkhorn/docker-container-status-notifier#Screenshots">screenshots</a> for more example images.</p>
</div>

## Usage

### Within a Docker container

It is possible to run this code inside a Docker container by passing the volume (`-v`) flag with the `run` command. This will pass the Docker daemon socket from the host to the container and enable calls to the [Docker Engine API](https://docs.docker.com/engine/api/latest). In this code the API is called using the [dockerode](https://github.com/apocas/dockerode) module by checking for updates in the stream to the [Events API](https://docs.docker.com/engine/api/v1.40/#operation/SystemEvents).

#### From Docker Hub Image

This will pull the image from [Docker Hub](https://hub.docker.com/) and run the image with the provided configuration for web hooks as below. One can provide only the Webhook URL or both the Webhook ID and token.

```sh
# Providing Discord Webhook URL
$ docker run -d -v /var/run/docker.sock:/var/run/docker.sock \
    -e DISCORD_WEBHOOK_URL=<URL_HERE> \
    knutkirkhorn/docker-container-status-notifier

# Providing both Discord Webhook ID and token
$ docker run -d -v /var/run/docker.sock:/var/run/docker.sock \
    -e DISCORD_WEBHOOK_ID=<ID_HERE> \
    -e DISCORD_WEBHOOK_TOKEN=<TOKEN_HERE> \
    knutkirkhorn/docker-container-status-notifier
```

#### From source code

```sh
# Build container from source
$ docker build -t docker-container-status-notifier .

# Run the built container
$ docker run -d -v /var/run/docker.sock:/var/run/docker.sock \
    -e DISCORD_WEBHOOK_URL=<URL_HERE> \
    docker-container-status-notifier
```

### Outside of a Docker container

```sh
# Install
$ npm install

# Run
$ npm start
```

### Environment variables

Provide these with the docker run command or store these in a `.env` file. Only `DISCORD_WEBHOOK_URL` or both `DISCORD_WEBHOOK_ID` and `DISCORD_WEBHOOK_TOKEN` are required.

- `DISCORD_WEBHOOK_URL`
    - URL to the Discord Webhook containing both the ID and the token
    - Format: `DISCORD_WEBHOOK_URL=https://discordapp.com/api/webhooks/<ID_HERE>/<TOKEN_HERE>`
- `DISCORD_WEBHOOK_ID`
    - ID for the Discord Webhook
- `DISCORD_WEBHOOK_TOKEN`
    - Token for the Discord Webhook

## Screenshots

![Container created](https://raw.githubusercontent.com/knutkirkhorn/docker-container-status-notifier/main/media/container-created.png)
![Container started](https://raw.githubusercontent.com/knutkirkhorn/docker-container-status-notifier/main/media/container-started.png)
![Container stopped](https://raw.githubusercontent.com/knutkirkhorn/docker-container-status-notifier/main/media/container-stopped.png)
![Container killed](https://raw.githubusercontent.com/knutkirkhorn/docker-container-status-notifier/main/media/container-killed.png)
![Container removed](https://raw.githubusercontent.com/knutkirkhorn/docker-container-status-notifier/main/media/container-removed.png)

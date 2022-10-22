FROM golang:1.17-alpine AS builder
ENV CGO_ENABLED=0
WORKDIR /backend
COPY vm/go.* .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go mod download
COPY vm/. .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go build -trimpath -ldflags="-s -w" -o bin/service

FROM --platform=$BUILDPLATFORM node:17.7-alpine3.14 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm run build

FROM alpine
LABEL org.opencontainers.image.title="Graph View" \
    org.opencontainers.image.description="See all your Docker containers, images and volumes in a Network Graph" \
    org.opencontainers.image.vendor="Lucas Bernalte" \
    com.docker.desktop.extension.api.version=">= 0.2.3" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/lucbpz/graph-view-docker-extension/main/network-graph.svg" \
    com.docker.extension.categories="utility-tools" \
    com.docker.extension.screenshots="[ \
    {\"url\": \"https://raw.githubusercontent.com/lucbpz/graph-view-docker-extension/main/screenshots/1-network-graph.svg\", \
     \"alt\": \"Network Graph visualization of your Docker containers\"}, \
    {\"url\": \"https://raw.githubusercontent.com/lucbpz/graph-view-docker-extension/main/screenshots/2-detail.svg\", \
     \"alt\": \"Detail of Docker container\"} \
    ]" \
    com.docker.extension.detailed-description="<p>With Graph View you can:</p> \
    <ul> \
    <li>View your Docker containers in a way you have never seen before!</li> \
    <li>See the details of a Docker container, image or volume when clicking.</li> \
    <li>Anything else that comes to mind?</li> \
    </ul> \
    <br/> \
    <p>Go to our <a href=\"https://github.com/lucbpz/graph-view-docker-extension\">GitHub repo</a> and feel free to contribute!</p> \
    "\
    com.docker.extension.publisher-url="https://www.twitter.com/lucasbernalte" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.changelog=""

COPY --from=builder /backend/bin/service /
COPY docker-compose.yaml .
COPY metadata.json .
COPY network-graph.svg .
COPY --from=client-builder /ui/build ui
CMD /service -socket /run/guest-services/extension-graph-view.sock

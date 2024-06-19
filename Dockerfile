# Stage 1: Build the project
FROM node:alpine as build

RUN npm install --global cross-env

WORKDIR /app

COPY . .

RUN apk add --no-cache git

# Keep the container alive
CMD tail -f /dev/null

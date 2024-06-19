# Stage 1: Build the project
FROM node:alpine as build

WORKDIR /app

COPY . .

RUN apk add --no-cache git
RUN npm install --global cross-env
RUN npm install --global webpack webpack-cli

# Install project dependencies
RUN yarn install

# Keep the container alive
CMD tail -f /dev/null
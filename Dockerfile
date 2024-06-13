# Stage 1: Build the project
FROM node:alpine as build

WORKDIR /app


COPY . .

RUN apk add --no-cache git
RUN cd web && yarn && yarn build --env dev_server


FROM python:3.9-alpine

# Copy the build output from the first stage
COPY --from=build /app/web/dist/integreat /app

# Expose the port the app runs on
EXPOSE 8000

# Start the Python HTTP server
CMD ["python3", "-m", "http.server", "-d", "/app", "8000"]
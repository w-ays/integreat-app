#!/bin/bash

# Define your image and container names
IMAGE_NAME="events-front-app"
CONTAINER_NAME="events-front-app-container"

# Check if the Docker image exists
if [ -z "$(docker images -q $IMAGE_NAME)" ]; then
    echo "Image does not exist. Building the image..."
    docker build -t $IMAGE_NAME .
else
    echo "Image exists."
fi

# Check if the Docker container exists
if [ -z "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "Container does not exist. Running the container..."
    docker run -d -p 8081:8000 --name $CONTAINER_NAME $IMAGE_NAME
else
    echo "Container exists."

    # Check if the Docker container is running
    if [ -z "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        echo "Container is not running. Starting the container..."
        docker start $CONTAINER_NAME
    else
        echo "Container is already running."
    fi
fi
#!/bin/bash

# Define your image and container names
IMAGE_NAME="events-ui"
CONTAINER_NAME="events-ui-instance"
NGINX_PROJECT_FOLDER="/var/www/events-ui"
NGINX_CONF="/etc/nginx/conf.d/events.conf"

# Check if the NGINX_PROJECT_FOLDER exists
if [ -d "$NGINX_PROJECT_FOLDER" ]; then
    echo "Directory exists. Deleting its contents..."
    rm -rf $NGINX_PROJECT_FOLDER/*
else
    echo "Directory does not exist. Creating it..."
    mkdir -p $NGINX_PROJECT_FOLDER
fi

# Copy the events.conf file to the conf.d directory of Nginx
cp events.conf $NGINX_CONF

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
    docker run -d -v $NGINX_PROJECT_FOLDER:/app/web/dist/integreat --name $CONTAINER_NAME $IMAGE_NAME
    # Go inside the container and run the commands
    docker exec -it $CONTAINER_NAME sh -c "cd /app/web && yarn build --env dev_server"
else
    echo "Container exists."

    # Check if the Docker container is running
    if [ -z "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        echo "Container is not running. Starting the container..."
        docker start $CONTAINER_NAME

        # Go inside the container and run the commands
        docker exec -it $CONTAINER_NAME sh -c "cd /app/web && yarn build --env dev_server"
    else
        echo "Container is already running."
    fi
fi
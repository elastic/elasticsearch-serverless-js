ARG NODE_JS_VERSION=20
FROM node:${NODE_JS_VERSION}

# install zip util
RUN apt-get clean -y && \
    apt-get update -y && \
    apt-get install -y zip

# Set user permissions and directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

COPY . .

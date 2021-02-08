FROM node:13.12.0-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json .
RUN npm install

# Copying source files
COPY . .

FROM node:latest

WORKDIR /usr/local/api

COPY package.json .

COPY dist/api .

RUN yarn install --production

EXPOSE 8080

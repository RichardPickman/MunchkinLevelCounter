FROM node:lts

WORKDIR /usr/local/api

COPY package.json .
COPY api/build .
COPY .env .

RUN yarn install --production

EXPOSE 8080

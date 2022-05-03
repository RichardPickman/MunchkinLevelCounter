FROM node:lts

WORKDIR /usr/local/ui

COPY package.json .
COPY ui/next.config.js .
COPY ui/build ./build
COPY ui/.env .



RUN yarn install --production

EXPOSE 3000

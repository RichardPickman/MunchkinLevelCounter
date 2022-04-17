FROM node:17

WORKDIR /usr/local/api

COPY package.json .
COPY .env .
COPY dist/api .

RUN yarn install --production

EXPOSE 8080

CMD ["node", "index.js"]
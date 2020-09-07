FROM node:alpine

WORKDIR /usr/influx-data-generator
COPY ./package.json  ./
COPY ./package-lock.json  ./
RUN npm install

COPY ./app.js  ./

CMD ["npm", "start"]
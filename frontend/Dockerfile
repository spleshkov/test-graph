# pull official base image
FROM node:15.8.0-alpine

# set work directory
WORKDIR /usr/src/app

COPY ./package.json .

RUN npm install -g serve
RUN npm install

# copy react project
COPY . .

# build react project
RUN npm run build

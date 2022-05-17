# syntax=docker/dockerfile:1
FROM node:alpine
WORKDIR /usr/integrations_tests
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3333
CMD ["npm", "run", "dev"]
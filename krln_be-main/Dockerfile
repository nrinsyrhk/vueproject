# Stage 1: Build the application
FROM node:16.17.0-bullseye-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
 
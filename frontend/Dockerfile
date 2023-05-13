FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY . .

RUN npm i
RUN npm run build
CMD HOST=172.20.0.11 PORT=5176 node build


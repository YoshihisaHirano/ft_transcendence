FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY . .

RUN npm i
RUN npm run build
ENTRYPOINT HOST=172.20.0.11 PORT=5176 node -r dotenv/config build


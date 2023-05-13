FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY . .
WORKDIR nest_backend
# RUN npm ci --production
RUN npm install
RUN npm install class-transformer
EXPOSE 3000
ENTRYPOINT npm run start

# CMD ["tail -f /dev/null"]
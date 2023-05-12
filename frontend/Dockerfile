FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY . .
# RUN npm ci --production
RUN npm install
# RUN npm install class-transformer
CMD [ "npm", "run", "dev" ]
# CMD [ "npm", "run", "build" ]

# CMD ["tail -f /dev/null"]
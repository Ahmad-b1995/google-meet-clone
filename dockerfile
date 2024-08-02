FROM node:18
WORKDIR /app
COPY package*.json ./
RUN yarn install --verbose
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]

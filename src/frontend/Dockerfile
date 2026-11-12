FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV CI=1
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV REACT_NATIVE_PACKAGER_HOSTNAME=localhost

EXPOSE 8081 19000 19001 19002

CMD ["npx", "expo", "start", "--tunnel", "ngrok"]

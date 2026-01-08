FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache bash git

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 8081 19000 19001 19002

ARG API_URL=http://host.docker.internal:3000
ENV EXPO_PUBLIC_API_URL=${API_URL}

CMD ["npm", "start"]

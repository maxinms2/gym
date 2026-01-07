FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache bash git

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 8081 19000 19001 19002

ENV EXPO_OFFLINE=1
ENV API_URL=http://api:3000

CMD ["npm", "start", "--", "--offline"]

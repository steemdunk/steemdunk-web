FROM node:12.1.0-alpine
WORKDIR /app

RUN apk update && \
      apk upgrade && \
      apk add --no-cache \
        git

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-concurrency 1 && \
      rm -r /usr/local/share/.cache

COPY . .

ENV SD_WEB_HOST=0.0.0.0
ENV SD_WEB_PORT=3000

ARG SC_BROADCAST_ACCOUNT=steemdunk
ARG SC_HOST=https://v2.steemconnect.com
ARG SC_REDIRECT_URI=https://steemdunk.xyz/callback

ARG API_URL_BROWSER=https://api.steemdunk.xyz
ENV API_URL_BROWSER="${API_URL_BROWSER}"
ARG API_URL=http://localhost:3001
ENV API_URL="${API_URL}"

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]

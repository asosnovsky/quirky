FROM node:21 as builder

WORKDIR /webapp

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY .parcelrc .parcelrc
COPY babel.config.js babel.config.js
COPY src src
RUN npm run build

FROM nginx

COPY --from=builder /webapp/dist /usr/share/nginx/html

EXPOSE 80
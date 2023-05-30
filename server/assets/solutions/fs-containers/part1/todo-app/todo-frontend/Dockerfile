FROM node:16 AS test-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENV CI=true

RUN npm test

# build

FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY --from=test-stage /usr/src/app .

ENV REACT_APP_BACKEND_URL=http://localhost:8080/api/

RUN npm run build

# serve

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

# docker build -t todo-front .
# docker run -p3001:80 todo-front
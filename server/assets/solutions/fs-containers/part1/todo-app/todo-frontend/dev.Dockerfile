FROM node:16

WORKDIR /usr/src/app

COPY . .

ENV REACT_APP_BACKEND_URL=http://localhost:8080/api/

RUN npm install

CMD ["npm", "start"]
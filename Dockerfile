FROM node:12-alpine

WORKDIR /projects
COPY . /projects/sc-user-service

WORKDIR /projects/sc-user-service
RUN npm install

CMD ["node", "app.js"]
FROM node:20-alpine3.17 as common-build-stage

COPY . ./app

WORKDIR /app

RUN npm i -g yarn --force

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]


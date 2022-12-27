FROM node:16-alpine3.16

RUN apk update && apk add bash
RUN apk --no-cache add curl

WORKDIR /app
COPY . .
RUN npm install

CMD ["npm", "start"]
EXPOSE 3000
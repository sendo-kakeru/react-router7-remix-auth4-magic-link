FROM node:20.12.2-alpine3.18

WORKDIR /usr/server
COPY ./ .
RUN npm i
CMD ["npm", "run", "dev"]
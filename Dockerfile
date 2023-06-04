FROM node:18-alpine

WORKDIR /web_app_files

COPY package.json ./

RUN npm install
COPY . ./

EXPOSE 5137

CMD [ "npm", "run", "preview" ]

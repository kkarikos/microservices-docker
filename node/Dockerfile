# use latest LTS version
FROM node:argon

# create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install deps
COPY package.json /usr/src/app
RUN npm install

# bundle app source
COPY . /usr/src/app

CMD ["npm", "start"]

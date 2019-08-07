FROM node:10-alpine
# Create app directory
RUN mkdir /ecommerceapi && chown -R root /ecommerceapi
WORKDIR /ecommerceapi

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chown=root . .

EXPOSE 8089
CMD [ "node", "index.js" ]

#Database
FROM mysql:5.7.27
COPY ./database/tshirtshop.sql /docker-entrypoint-initdb.d/tshirtshop.sql

#Database
FROM mysql:latest
# SETUP DATABASES
ENV MYSQL_DATABASE 'tshirtshop'
ENV MYSQL_ROOT_PASSWORD 'root'
ENV MYSQL_USER 'turing'
ENV MYSQL_PASSWORD 'turing'
ENV MYSQL_RANDOM_ROOT_PASSWORD 'turing'
ENV MYSQL_ALLOW_EMPTY_PASSWORD true

FROM node:10-alpine

# Create app directory
WORKDIR /ecommerceapi
COPY tshirtshop.sql /docker-entrypoint-initdb.d/tshirtshop.sql

# Install app dependencies
COPY package*.json ./
#RUN npm install

# Bundle app source
COPY . .

EXPOSE 8081

CMD ["node", "index.js"]


	
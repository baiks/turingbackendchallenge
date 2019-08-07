#Database
FROM mysql:5.7.27
# SETUP DATABASES
ENV MYSQL_DATABASE 'turing'
ENV MYSQL_ROOT_PASSWORD 'root'
ENV MYSQL_USER 'turing'
ENV MYSQL_PASSWORD 'turing'
COPY ./database/tshirtshop.sql /docker-entrypoint-initdb.d/tshirtshop.sql

FROM node:10.15.3-alpine

# Create app directory
WORKDIR /ecommerceapi

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8081

CMD ["node", "index.js"]


	
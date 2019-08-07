#Database
FROM mysql:5.7.27
# SETUP DATABASES
ENV MYSQL_DATABASE 'turing'
ENV MYSQL_ROOT_PASSWORD 'root'
ENV MYSQL_USER 'turing'
ENV MYSQL_PASSWORD 'turing'

COPY ./database/tshirtshop.sql /docker-entrypoint-initdb.d/tshirtshop.sql


FROM node:10-alpine
# Create app directory
RUN mkdir /ecommerceapi && chown -R root /ecommerceapi
WORKDIR /ecommerceapi

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./ecommerceapi

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chown=root . .

EXPOSE 8081

COPY turing-entrypoint.sh /turing-entrypoint.sh

CMD ["sh", "turing-entrypoint.sh"]


	
const fs = require('fs');
const jwt = require('jsonwebtoken');
//https://medium.com/@siddharthac6/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e
module.exports = {
  sign: (payload) => {
    var options = { expiresIn: '24h' };
    console.log("payload:: " + JSON.stringify(payload));
    options.accessToken = jwt.sign(payload, 'secret', options);
    return options;
  },
  verify: (token) => {
    try {
      jwt.verify(token, 'secret');
      return true;
    } catch (err) {
      return false;
    }
  }
}
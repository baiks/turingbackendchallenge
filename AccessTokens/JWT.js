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
    console.log("USER-KEY:: " + token.split(" ")[1]);
    try {
      jwt.verify(token.split(" ")[1], 'secret');
      return true;
    } catch (err) {
      return false;
    }
  }
}
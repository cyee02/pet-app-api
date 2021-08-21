const jwt = require('jsonwebtoken')
const { JWT_SECRET } =  require('../config')

const verifyJwt = (token, options) => {
  return jwt.verify(token, JWT_SECRET, options)
};

module.export = verifyJwt
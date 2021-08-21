const jwt = require('jsonwebtoken')
const { JWT_SECRET } =  require('../config')

const signJwt = (payload, options) => {
  return jwt.sign(payload, JWT_SECRET, options)
}

module.export = signJwt

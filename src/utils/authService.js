const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken')
const { JWT_SECRET, ACCESS_TOKEN_EXPIRATION_TIME } =  require('../config')

const subject = 'accessToken'

const signJwt = (payload, options) => {
  return jwt.sign(payload, JWT_SECRET, options)
}

const createAccessToken = (userId) => {
  const expiresAt = new Date(Date.now() + ACCESS_TOKEN_EXPIRATION_TIME);
  return {
    accessToken: signJwt(
      { userId },
      {
        expiresIn: expiresAt - new Date(),
        subject,
      },
    ),
    expiresAt: expiresAt
  };
}

const verifyToken = (token) => {
  try{
    return jwt.verify(token, JWT_SECRET)
  } catch (error){
    throw new AuthenticationError('Invalid authorization key')
  }
};

module.exports = { createAccessToken, verifyToken }
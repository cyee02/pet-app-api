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
// class AuthService {
//   constructor({ accessToken }) {
//     this.accessToken = accessToken;
//     // this.dataLoaders = dataLoaders;
//   }

//   async getAuthorizedUserId() {
//     if (!this.accessToken) {
//       return null;
//     }

//     let tokenPayload;

//     try {
//       tokenPayload = verifyJwt(this.accessToken, { subject });
//     } catch (e) {
//       return null;
//     }

//     return tokenPayload.userId;
//   }

//   // async getAuthorizedUser() {
//   //   const id = await this.getAuthorizedUserId();

//   //   if (!id) {
//   //     return null;
//   //   }

//   //   return this.dataLoaders.userLoader.load(id);
//   // }

//   // async getAuthorizedUserOrFail(error) {
//   //   const normalizedError =
//   //     error || new AuthenticationError('Please provide authorization key');

//   //   const user = await this.getAuthorizedUser();

//   //   if (!user) {
//   //     throw normalizedError;
//   //   }

//   //   return user;
//   // }


// }

module.exports = { createAccessToken, verifyToken }
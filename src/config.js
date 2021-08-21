const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, "./", '.env') });

const PORT = process.env.PORT || 4000;

const JWT_SECRET = process.env.JWT_SECRET;

const ACCESS_TOKEN_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7;

module.exports = {
  PORT,
  JWT_SECRET,
  ACCESS_TOKEN_EXPIRATION_TIME
}
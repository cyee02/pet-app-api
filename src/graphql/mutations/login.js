const { gql, UserInputError } = require('apollo-server')
const yup = require('yup')
const bcrypt = require('bcryptjs')
const {createAccessToken} = require('../../utils/authService')

const getLogin = require('../../aws/getLogin')

const typeDefs = gql`
  type Token {
    username: String!
    accessToken: String!
    expiresAt: String
  }
  extend type Mutation {
    login(username: String!, password: String!): Token
  }
`

const argsSchema = yup.object().shape({
  username: yup.string().required().lowercase().trim(),
  password: yup.string().required().trim()
})

const resolvers = {
  Mutation: {
    login: async (root, args, context) => {
      const {username, password} = await argsSchema.validate(args, {stripUnknown: true})
      const results = await getLogin(username)

      if (results !== undefined){
        // Check password
        const match = await bcrypt.compare(password, results.password);
        if (!match) {
          throw new UserInputError('Invalid username or password');
        }

        const token = createAccessToken({
          "username": username,
          "id": results.id,
        })
        return {
          "username": username,
          "accessToken": token.accessToken,
          "expiresAt": token.expiresAt
        }
      } else {
        throw new UserInputError('Invalid username or password')
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
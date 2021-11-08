const { gql, AuthenticationError } = require('apollo-server')
const getMessage = require('../../aws/getMessage')

const typeDefs = gql`
  extend type Query {
    getMessage: [Message]
  }
`

const resolvers = {
  Query: {
    getMessage: async (root, args, context) => {
      // Check authorization
      if (!context.user) throw new AuthenticationError("Please provide authorization")
      const response = await getMessage(context.user.username, context.user.id)
      return response
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
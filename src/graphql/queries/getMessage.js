const { gql, AuthenticationError } = require('apollo-server')
const getMessage = require('../../aws/getMessage')

const typeDefs = gql`
  extend type Query {
    getMessage (conversationId: String!)
    : [Message]
  }
`

const resolvers = {
  Query: {
    getMessage: async (root, args, context) => {
      // Check authorization
      if (!context.user) throw new AuthenticationError("Please provide authorization")

      // Get input
      const {conversationId} = args
      const response = await getMessage(conversationId)
      return response
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
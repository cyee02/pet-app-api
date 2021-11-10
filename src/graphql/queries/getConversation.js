const { gql, AuthenticationError } = require('apollo-server')
const getConversation = require('../../aws/getConversation')

const typeDefs = gql`
  extend type Query {
    getConversation: [Conversation]
  }
`

const resolvers = {
  Query: {
    getConversation: async (root, args, context) => {
      // Check authorization
      if (!context.user) throw new AuthenticationError("Please provide authorization")

      // Query table
      const conversations = await getConversation(context.user.username)

      return conversations
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
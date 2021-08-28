const { gql, AuthenticationError } = require('apollo-server')

const typeDefs = gql`
  extend type Query {
    getUser: User
  }
`

const resolvers = {
  Query: {
    getUser: async (root, args, context) => {
      if (context.user) {
        // Remove id
        delete context.user.id
        return context.user
      } else {
        throw new AuthenticationError("Please provide authorization")
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
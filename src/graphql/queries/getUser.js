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
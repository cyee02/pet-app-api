const { gql, AuthenticationError } = require('apollo-server')
const getProfile = require('../../aws/getProfile')

const typeDefs = gql`
  extend type Query {
    getProfile (username: String!): Profile
  }
`

const resolvers = {
  Query: {
    getProfile: async (root, args, context) => {
      const response = await getProfile(args.username)
      return response
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
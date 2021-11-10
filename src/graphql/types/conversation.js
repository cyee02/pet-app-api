const { gql } = require('apollo-server')


const typeDefs = gql`
  type Conversation {
    conversationId: String!,
    users: [String!],
    conversationName: String
  }
`


module.exports = { typeDefs }
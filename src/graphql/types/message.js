const { gql } = require('apollo-server')


const typeDefs = gql`
  type Message {
    id: ID!
    user: String!
    text: String!
    created: DateTime!
  }
`

module.exports = { typeDefs }
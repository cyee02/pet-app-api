const { gql } = require('apollo-server')


const typeDefs = gql`
  type Image {
      imageType: String!
      image: Upload!
      created: DateTime!
      uri: String!
  }
`

module.exports = { typeDefs }
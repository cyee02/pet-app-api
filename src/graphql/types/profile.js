const { gql } = require('apollo-server')


const typeDefs = gql`
  type Profile {
    username: String!
    firstName: String
    lastName: String
    description: String
    profilePicture: [Image]
    images: [Image]
  }
`

module.exports = { typeDefs }
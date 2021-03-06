const { gql } = require('apollo-server')


const typeDefs = gql`
  type User {
    username: String!
    firstName: String
    lastName: String
    address: String
    gender: String
    phoneNumber: String
    description: String
    email: String
    profilePicture: [Image]
    images: [Image]
    friends: [Profile]
  }
`
// birthday: String
// groups: [String]


module.exports = { typeDefs }
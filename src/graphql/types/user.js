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
    }
    `
// birthday: String
// profilePicture: String
// followers: [String]
// following: [String]
// groups: [String]
// images: [String]

module.exports = { typeDefs }
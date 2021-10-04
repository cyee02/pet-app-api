const { gql, AuthenticationError } = require('apollo-server')
const putItem = require('../../aws/putItem')
const awsConfig = require('../../aws/aws-config.json')

const typeDefs = gql`
  extend type Mutation {
    updateUser(
      firstName: String!,
      lastName: String!,
      address: String!,
      phoneNumber: String!,
      description: String!,
    ): User
  }
`

const resolvers = {
  Mutation: {
    updateUser: async (root, args, context) => {
      // Check authorization
      if (!context.user) throw new AuthenticationError("Please provide authorization")

      // Get input
      const {
        firstName,
        lastName,
        address,
        phoneNumber,
        description,
      } = args

      // Update user info in pet-app-userInfo table
      const newUserInfo = {
          ...context.user,
          "firstName": firstName,
          "lastName": lastName,
          "address": address,
          "phoneNumber": phoneNumber,
          "description": description,
      }

      const updateUserInfo = await putItem(awsConfig.DynamoDBUserTable, newUserInfo)
      if (updateUserInfo.$metadata.httpStatusCode !==200){
        return updateUserInfo
      } else {
        return newUserInfo
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
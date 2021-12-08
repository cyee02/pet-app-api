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
        "username": context.user.username,
        "id": context.user.id,
        "address": address,
        "email": context.user.email,
        "gender": context.user.gender,
        "phoneNumber": phoneNumber,
      }
      const newProfileInfo = {
        "username": context.user.username,
        "description": description,
        "firstName": firstName,
        "lastName": lastName,
        "images": context.user.images,
        "profilePicture": context.user.profilePicture,
      }

      const updateUserInfo = await putItem(awsConfig.DynamoDBUserTable, newUserInfo)
      const updateProfileInfo = await putItem(awsConfig.DynamoDBProfileTable, newProfileInfo)
      if (updateUserInfo.$metadata.httpStatusCode !==200){
        return updateUserInfo
      } else if (updateProfileInfo.$metadata.httpStatusCode !==200){
        return updateProfileInfo
      } else {
        delete newProfileInfo.username
        return Object.assign(newUserInfo, newProfileInfo, {"email": context.user.email})
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
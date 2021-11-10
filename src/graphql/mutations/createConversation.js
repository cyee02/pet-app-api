const { gql } = require('apollo-server')
const {v4: uuid} = require('uuid')

const awsConfig = require('../../aws/aws-config.json')
const putItem = require('../../aws/putItem')
const getConversation = require('../../aws/getConversation')

const typeDefs = gql`
  extend type Mutation {
    createConversation(
      users: [String!],
      conversationName: String
    ): Conversation
  }
`

const resolvers = {
  Mutation: {
    createConversation: async (root, args, context) => {
      // Check authorization
      if (!context.user) throw new AuthenticationError("Please provide authorization")

      // Initiate input
      const {users, conversationName} = args

      // Add current user to list of users
      users.push(context.user.username)

      // new Conversation item
      const conversationId = uuid()
      const newConversation = {
        "conversationId": conversationId,
        "users": users,
        "conversationName": conversationName
      }

      // Create new conversation for each user
      users.forEach(async user => {
        var conversations = await getConversation(user)
        conversations.splice(0, 0, newConversation)
        var newItem = { "username": user, "conversations": conversations }
        await putItem(awsConfig.DynamoDBConversationTable, newItem)
      });

      // Create new id in message table
      const newMessageItem = {"conversationId": conversationId}
      await putItem(awsConfig.DynamoDBMessageTable, newMessageItem )

      return newConversation
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
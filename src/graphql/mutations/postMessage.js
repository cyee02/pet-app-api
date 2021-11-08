const { gql, AuthenticationError } = require('apollo-server')
const {v4: uuid} = require('uuid')
const putItem = require('../../aws/putItem')
const getMessage = require('../../aws/getMessage')
const awsConfig = require('../../aws/aws-config.json')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub();

const typeDefs = gql`
  extend type Mutation {
    postMessage(
      user: String!,
      text: String!
    ): Message
  }
  extend type Subscription {
    messages: [Message]
  }
`

const resolvers = {
  Mutation: {
    postMessage: async (root, args, context) => {
      // Check authorization
      if (!context.user) throw new AuthenticationError("Please provide authorization")

      // Get input
      const {
        user,
        text,
      } = args

      const newMessage = {
        "id": uuid(),
        "user": user,
        "text": text,
        "created": Date.now().toString()
      }

      // Get Message
      const currentMessages = await getMessage(context.user.username, context.user.id)

      if (currentMessages === undefined) { //for user who has not started chatting
        var newMessages = [newMessage]
      } else {
        // To insert the info into index 0, not deleting any data
        currentMessages.splice(0, 0, newMessage)
        var newMessages = currentMessages
      }

      // Update user info in pet-app-userInfo table
      const payload = {
          "username": context.user.username,
          "id": context.user.id,
          "messages": newMessages,
      }

      // Publish new messages
      context.pubsub.publish('MESSAGES', {messages: [newMessage]})

      const updateMessage = await putItem(awsConfig.DynamoDBMessageTable, payload)
      if (updateMessage.$metadata.httpStatusCode !==200){
        return "Error updating chat"
      } else {
        return newMessage
      }
    }
  },
  Subscription: {
    messages: {
      subscribe: (root, args, context) => {
        return context.pubsub.asyncIterator(['MESSAGES'])
      },
    },
  },
}

module.exports = {
  typeDefs,
  resolvers
}
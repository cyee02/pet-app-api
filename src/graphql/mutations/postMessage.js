const { gql, AuthenticationError } = require('apollo-server')
const {v4: uuid} = require('uuid')
const putItem = require('../../aws/putItem')
const getMessage = require('../../aws/getMessage')
const awsConfig = require('../../aws/aws-config.json')

const typeDefs = gql`
  extend type Mutation {
    postMessage(
      text: String!
      conversationId: String!
    ): Message
  }
  extend type Subscription {
    messages(conversationId: String!): [Message]
  }
`

const resolvers = {
  Mutation: {
    postMessage: async (root, args, context) => {
      // Check authorization
      if (!context.user) throw new AuthenticationError("Please provide authorization")

      // Get input
      const { text, conversationId } = args

      const newMessage = {
        "id": uuid(),
        "user": context.user.username,
        "text": text,
        "created": Date.now().toString()
      }

      // Get Message
      const messages = await getMessage(conversationId)
      messages.splice(0, 0, newMessage)

      // Update user info in pet-app-userInfo table
      const payload = {
        "conversationId": conversationId,
        "messages": messages,
      }

      // Publish new messages
      context.pubsub.publish(conversationId, {messages: messages})

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
      subscribe: async (root, args, context) => {
        const {conversationId} = args
        // Get Message
        const messages = await getMessage(conversationId)
        setTimeout(() => context.pubsub.publish(conversationId, {messages: messages}), 0);
        return context.pubsub.asyncIterator([conversationId])
      },
    },
  },
}

module.exports = {
  typeDefs,
  resolvers
}
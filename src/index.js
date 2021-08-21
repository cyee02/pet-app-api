const { ApolloServer } = require('apollo-server-lambda');
const { typeDefs, resolvers } = require('./graphql/schema.js')
const  { verifyToken } = require('./utils/authService')
const getUser = require('./aws/getUser')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ event }) => {
    const authorization = event ? event.headers.Authorization : null
    if (authorization) {
      const accessToken = verifyToken(authorization)
      const user = await getUser(accessToken.userId)
      return {
        user
      }
    }
  },
})

exports.handler = server.createHandler()
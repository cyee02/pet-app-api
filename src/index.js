const express = require('express');
const cors = require('cors')
const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions')
const { typeDefs, resolvers } = require('./graphql/schema.js')
const  { verifyToken } = require('./utils/authService')
const getUser = require('./aws/getUser')
const {createServer} = require('http')
const { SubscriptionServer } = require ('subscriptions-transport-ws')
const { makeExecutableSchema } = require ('@graphql-tools/schema')
const { execute, subscribe } = require ('graphql')

const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.SERVER_PORT || 4000;
const pubsub = new PubSub();

app.use(cors())
app.use(bodyParser.json({limit: '50mb', extended: true}))

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const server = new ApolloServer({
  schema,
  plugins: [{
    async serverWillStart() {
      return {
        async drainServer() {
          subscriptionServer.close();
        }
      };
    }
  }],
  context: async ({ req }) => {
    const authorization = req ? req.headers.authorization : null
    if (authorization) {
      const accessToken = verifyToken(authorization)
      var user = await getUser(accessToken.userId)
      return {
        user,
        pubsub
      }
    }
  },
  playground: true
})

server.applyMiddleware({
  app
});

const httpServer = createServer(app)

const subscriptionServer = SubscriptionServer.create({
  schema,
  execute,
  subscribe,
  async onConnect () {
    return {pubsub}
  },
}, {
  server: httpServer,
  path: server.graphqlPath,
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
})
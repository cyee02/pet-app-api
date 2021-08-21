const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./graphql/schema.js')
const  { verifyToken } = require('./utils/authService')
const getUser = require('./aws/getUser')

const app = express();
const PORT = process.env.SERVER_PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const authorization = req ? req.headers.authorization : null
    console.log(req.headers);
    if (authorization) {
      const accessToken = verifyToken(authorization)
      const user = await getUser(accessToken.userId)
      return {
        user
      }
    }
  },
  playground: true
})

server.applyMiddleware({
  app
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
})
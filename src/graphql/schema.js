const { gql } = require('apollo-server')
const { merge } = require('lodash')

// Scalars
const DateTime = require('./scalars/DateTime');

// Queries
const getUser = require('./queries/getUser')
const getMessage = require('./queries/getMessage')

// Mutations
const login = require('./mutations/login')
const uploadImage = require('./mutations/uploadImage')
const signup = require('./mutations/signup')
const updateUser = require('./mutations/updateUser')
const postMessage = require('./mutations/postMessage')

// Types
const user = require('./types/user')
const image = require('./types/image')
const message = require('./types/message')

const rootTypeDefs = gql`
  type Query {
    root: String
  }

  type Mutation {
    root: String
  }

  type Subscription {
    root: String
  }
`;

const typeDefs = [
    rootTypeDefs,
    // Scalars
    DateTime.typeDefs,

    // Types
    user.typeDefs,
    image.typeDefs,
    message.typeDefs,

    // Queries
    getUser.typeDefs,
    getMessage.typeDefs,

    // Mutations
    login.typeDefs,
    uploadImage.typeDefs,
    signup.typeDefs,
    updateUser.typeDefs,
    postMessage.typeDefs,
]

const resolvers = merge(
    login.resolvers,
    uploadImage.resolvers,
    signup.resolvers,
    updateUser.resolvers,
    getUser.resolvers,
    getMessage.resolvers,
    postMessage.resolvers,
)

module.exports = { typeDefs, resolvers }

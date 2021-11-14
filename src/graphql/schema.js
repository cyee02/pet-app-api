const { gql } = require('apollo-server')
const { merge } = require('lodash')

// Scalars
const DateTime = require('./scalars/DateTime');

// Queries
const getUser = require('./queries/getUser')
const getProfile = require('./queries/getProfile')
const getProfiles = require('./queries/getProfiles')
const getConversation = require('./queries/getConversation')
const getMessage = require('./queries/getMessage')

// Mutations
const login = require('./mutations/login')
const uploadImage = require('./mutations/uploadImage')
const signup = require('./mutations/signup')
const updateUser = require('./mutations/updateUser')
const createConversation = require('./mutations/createConversation')
const postMessage = require('./mutations/postMessage')

// Types
const user = require('./types/user')
const profile = require('./types/profile')
const image = require('./types/image')
const message = require('./types/message')
const conversation = require('./types/conversation')

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
    profile.typeDefs,
    image.typeDefs,
    message.typeDefs,
    conversation.typeDefs,

    // Queries
    getUser.typeDefs,
    getProfile.typeDefs,
    getProfiles.typeDefs,
    getMessage.typeDefs,
    getConversation.typeDefs,

    // Mutations
    login.typeDefs,
    uploadImage.typeDefs,
    signup.typeDefs,
    updateUser.typeDefs,
    postMessage.typeDefs,
    createConversation.typeDefs,
]

const resolvers = merge(
    login.resolvers,
    uploadImage.resolvers,
    signup.resolvers,
    updateUser.resolvers,
    getUser.resolvers,
    getProfile.resolvers,
    getProfiles.resolvers,
    getConversation.resolvers,
    createConversation.resolvers,
    getMessage.resolvers,
    postMessage.resolvers,
)

module.exports = { typeDefs, resolvers }

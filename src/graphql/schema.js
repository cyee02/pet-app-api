const { gql } = require('apollo-server')
const { merge } = require('lodash')

// Scalars
const DateTime = require('./scalars/DateTime');

// Queries
const getUser = require('./queries/getUser')

// Mutations
const login = require('./mutations/login')
const uploadImage = require('./mutations/uploadImage')
const signup = require('./mutations/signup')
const updateUser = require('./mutations/updateUser')

// Types
const user = require('./types/user')
const image = require('./types/image')

const rootTypeDefs = gql`
  type Query {
    root: String
  }

  type Mutation {
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

    // Queries
    getUser.typeDefs,

    // Mutations
    login.typeDefs,
    uploadImage.typeDefs,
    signup.typeDefs,
    updateUser.typeDefs,
]

const resolvers = merge(
    login.resolvers,
    uploadImage.resolvers,
    signup.resolvers,
    updateUser.resolvers,
    getUser.resolvers,
)

module.exports = { typeDefs, resolvers }

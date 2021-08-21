const { gql } = require('apollo-server')
const { merge } = require('lodash')
const login = require('./mutations/login')
const uploadImage = require('./mutations/uploadImage')
const signup = require('./mutations/signup')
const getUser = require('./queries/getUser')

const user = require('./types/user')

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
    user.typeDefs,
    login.typeDefs,
    uploadImage.typeDefs,
    signup.typeDefs,
    getUser.typeDefs,
]

const resolvers = merge(
    login.resolvers,
    uploadImage.resolvers,
    signup.resolvers,
    getUser.resolvers,
)

module.exports = { typeDefs, resolvers }

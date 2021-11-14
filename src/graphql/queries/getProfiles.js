const { gql } = require('apollo-server')
const getBatchItems = require('../../aws/getBatchItems')
const awsConfig = require('../../aws/aws-config.json')

const typeDefs = gql`
  extend type Query {
    getProfiles (usernames: [String!]): [Profile]
  }
`

// Test variables

const resolvers = {
  Query: {
    getProfiles: async (root, args, context) => {
      const tableName = awsConfig.DynamoDBProfileTable
      const keys = args.usernames.map( username => {return({"username": username})})
      return await getBatchItems(tableName, keys)
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
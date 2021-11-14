const { DynamoDB } = require("@aws-sdk/client-dynamodb")
const dynamodb_client = new DynamoDB({region: "ap-southeast-1"})

const attr = require('dynamodb-data-types').AttributeValue

const getBatchItems = async (tableName, keys) => {
  const key = keys.map( key => attr.wrap(key))
  const requestItems = {}
  requestItems[tableName] = {
    Keys: key,
    ProjectionExpression: "username, description, firstName, lastName, profilePicture, images"
  }
  try {
    const results = await dynamodb_client.batchGetItem({RequestItems: requestItems})
    if (results.Responses === undefined){
      return undefined
    } else {
      return results.Responses[tableName].map( profile => attr.unwrap(profile))
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = getBatchItems
const { DynamoDB } = require("@aws-sdk/client-dynamodb")
const dynamodb_client = new DynamoDB({region: "ap-southeast-1"})
const awsConfig = require("./aws-config.json")
const getProfile = require("./getProfile")

const attr = require('dynamodb-data-types').AttributeValue;

const getUser = async (token) => {
  const key = attr.wrap(token)
  const params = {
    TableName: awsConfig.DynamoDBUserTable,
    Key: key,
    ProjectionExpression: "username, id, address, email, gender, phoneNumber"
  }
  try {
    const results = await dynamodb_client.getItem(params)
    const publicProfile = await getProfile(token.username)
    if (results.Item === undefined){
      return undefined
    } else {
      delete publicProfile.username
      return Object.assign(attr.unwrap(results.Item), publicProfile)
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = getUser
const { DynamoDB } = require("@aws-sdk/client-dynamodb")
const dynamodb_client = new DynamoDB({region: "ap-southeast-1"})
const awsConfig = require("./aws-config.json")

const attr = require('dynamodb-data-types').AttributeValue;

const getProfile = async (username) => {
  const key = attr.wrap({"username": username})
  const params = {
    TableName: awsConfig.DynamoDBProfileTable,
    Key: key,
    ProjectionExpression: "username, description, firstName, lastName, profilePicture, images"
  }
  try {
    const results = await dynamodb_client.getItem(params)
    if (results.Item === undefined){
      return undefined
    } else {
      return attr.unwrap(results.Item)
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = getProfile
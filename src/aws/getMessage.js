const { DynamoDB } = require("@aws-sdk/client-dynamodb")
const awsConfig = require("./aws-config.json")
const attr = require('dynamodb-data-types').AttributeValue;

const dynamodb_client = new DynamoDB({region: "ap-southeast-1"})

const getMessage = async (username, id) => {
  const key = attr.wrap({
    username: username,
    id: id
  })
  const params = {
    TableName: awsConfig.DynamoDBMessageTable,
    Key: key,
    ProjectionExpression: "messages"
  }
  try {
    const results = await dynamodb_client.getItem(params)
    if (results.Item ===  undefined){
      return undefined
    } else {
      return attr.unwrap(results.Item).messages
    }
  } catch (error) {
    return error
  }
}

module.exports = getMessage
const { DynamoDB } = require("@aws-sdk/client-dynamodb")
const awsConfig = require("./aws-config.json")
const attr = require('dynamodb-data-types').AttributeValue;

const dynamodb_client = new DynamoDB({region: "ap-southeast-1"})

const getConversation = async (username) => {
  const key = attr.wrap({
    username: username
  })
  const params = {
    TableName: awsConfig.DynamoDBConversationTable,
    Key: key,
    ProjectionExpression: "conversations"
  }
  try {
    const results = await dynamodb_client.getItem(params)
    if (results.Item ===  undefined){
      return []
    } else {
      return attr.unwrap(results.Item).conversations
    }
  } catch (error) {
    return error
  }
}

module.exports = getConversation
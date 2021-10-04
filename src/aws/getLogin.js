const { DynamoDB } = require("@aws-sdk/client-dynamodb")
const dynamodb_client = new DynamoDB({region: "ap-southeast-1"})
const awsConfig = require("./aws-config.json")

const attr = require('dynamodb-data-types').AttributeValue;

const getLogin = async (username) => {
  const params = {
    TableName: awsConfig.DynamoDBLoginTable,
    Key: {
      "username": {
        S: username
      }
    },
    ProjectionExpression: "id, password"
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

module.exports = getLogin
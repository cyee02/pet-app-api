const { DynamoDB } = require("@aws-sdk/client-dynamodb")
const attr = require('dynamodb-data-types').AttributeValue;

const dynamodb_client = new DynamoDB({region: "ap-southeast-1"})

const putItem = async (tableName, payload) => {
  const item = attr.wrap(payload)
  const params = {
    TableName: tableName,
    Item: item
  }
  try {
    const results = await dynamodb_client.putItem(params)
    return results
  } catch (error) {
    // console.log(error)
    return error
  }
}

module.exports = putItem
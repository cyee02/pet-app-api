const { DynamoDB } = require("@aws-sdk/client-dynamodb")
const dynamodb_client = new DynamoDB()

const describeTable = async (tableName) => {
  try {
    const results = await dynamodb_client.describeTable({TableName: tableName})
    return results
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = describeTable
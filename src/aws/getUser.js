const { DynamoDB } = require("@aws-sdk/client-dynamodb")
const dynamodb_client = new DynamoDB({region: "ap-southeast-1"})

const attr = require('dynamodb-data-types').AttributeValue;

const getUser = async (token) => {
  const key = attr.wrap(token)
  const params = {
    TableName: "pet-app-userInfo",
    Key: key,
    ProjectionExpression: "username, id, address, description, email, firstName, lastName, gender, phoneNumber, profilePicture, images"
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

module.exports = getUser
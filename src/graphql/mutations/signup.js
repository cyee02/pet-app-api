const { gql, ApolloError } = require('apollo-server')
const yup = require('yup')
const bcrypt = require('bcryptjs')
const {v4: uuid} = require('uuid')

const awsConfig = require('../../aws/aws-config.json')
const getLogin = require('../../aws/getLogin')
const putItem = require('../../aws/putItem')

const typeDefs = gql`
  extend type Mutation {
    signup(
      username: String!,
      password: String!,
      firstName: String!,
      lastName: String!,
      address: String!,
      gender: String!,
      phoneNumber: String!,
      description: String!,
      email: String!
    ): User
  }
`

class UsernameTakenError extends ApolloError {
  constructor(message, properties) {
    super(message, 'USERNAME_TAKEN', properties);
  }

  static fromUsername(username) {
    return new UsernameTakenError(
      `Username ${username} is already taken. Choose another username`,
      { username },
    );
  }
}

const argsSchema = yup.object().shape({
  username: yup.string().min(1).max(30).lowercase().trim(),
  password: yup.string().min(5).max(50).trim(),
})

const createPasswordHash = (password) => bcrypt.hash(password, 10);

const resolvers = {
  Mutation: {
    signup: async (root, args, context) => {
      // Validate username password input
      const {username, password} = await argsSchema.validate(args, {stripUnknown: true})

      // Get input
      const {
        firstName,
        lastName,
        address,
        gender,
        phoneNumber,
        description,
        email
      } = args

      // Check if username exists
      const userExist = await getLogin(username)
      if (userExist !== undefined) throw UsernameTakenError.fromUsername(username)

      // Generate userId and passwordHash
      const userId = uuid()
      const passwordHash = await createPasswordHash(password)

      // Create new user in login table
      const newUser = {
        "username": username,
        "id": userId,
        "password": passwordHash
      }
      // Private information to store in user table
      const newUserInfo = {
          "username": username,
          "id": userId,
          "address": address,
          "gender": gender,
          "phoneNumber": phoneNumber,
          "email": email,
      }
      // Public information to store in profile table
      const newProfileInfo = {
        "username": username,
        "firstName": firstName,
        "lastName": lastName,
        "description": description
      }
      
      const updateUser = await putItem(awsConfig.DynamoDBLoginTable, newUser)
      const updateUserInfo = await putItem(awsConfig.DynamoDBUserTable, newUserInfo)
      const updateProfileInfo = await putItem(awsConfig.DynamoDBProfileTable, newProfileInfo)
      if (updateUser.$metadata.httpStatusCode !== 200){
        return updateUser
      } else if (updateUserInfo.$metadata.httpStatusCode !== 200){
        return updateUserInfo
      } else if (updateProfileInfo.$metadata.httpStatusCode !== 200){
        return updateProfileInfo
      } else {
        return {
          "username": username,
          "id": userId,
          "firstName": firstName,
          "lastName": lastName,
          "description": description,
          "address": address,
          "gender": gender,
          "phoneNumber": phoneNumber,
          "email": email,
        }
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
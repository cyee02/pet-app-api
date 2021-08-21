const { gql, ApolloError } = require('apollo-server')
const yup = require('yup')
const bcrypt = require('bcryptjs')
const {v4: uuid} = require('uuid')

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
      if (userExist === undefined){
        const userId = uuid()
        const passwordHash = await createPasswordHash(password)

        // Create new user in pet-app-login table
        var newUser = {
          "username": username,
          "id": userId,
          "password": passwordHash
        }
        // Create new user in pet-app-userInfo table
        var newUserInfo = {
            "username": username,
            "id": userId,
            "firstName": firstName,
            "lastName": lastName,
            "address": address,
            "gender": gender,
            "phoneNumber": phoneNumber,
            "description": description,
            "email": email,
        }
        
        const updateUser = await putItem("pet-app-login", newUser)
        const updateUserInfo = await putItem("pet-app-userInfo", newUserInfo)
        if (updateUser.$metadata.httpStatusCode !== 200){
          return updateUser
        } else if (updateUserInfo.$metadata.httpStatusCode !==200){
          return updateUserInfo
        } else {
          return {
            username: username,
            firstName: firstName,
            lastName: lastName,
            address: address,
            gender: gender,
            phoneNumber: phoneNumber,
            description: description,
            email: email
          }
        }
      } else {
        throw UsernameTakenError.fromUsername(username)
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
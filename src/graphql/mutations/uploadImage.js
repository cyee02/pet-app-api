const { gql, AuthenticationError, ValidationError } = require('apollo-server')

// AWS actions
const upload = require('../../aws/upload')
const putItem = require('../../aws/putItem')

const resolvers = {
  Mutation: {
    uploadImage: async (root, args, context) => {
      if (!context.user) throw new AuthenticationError("Please provide authorization")
      const {image, imageType} = args
      if (imageType !== "profilePicture" && imageType !== "images") throw new ValidationError (`imageType must be 'profilePicture' or 'images', received '${imageType}'`)

      const userInfo = context.user
      const folder = `users/${userInfo.username}/image/${imageType}/`

      // Upload picture to s3
      const uploadResult = await upload(image, folder)

      // Update dynamodb for the uri
      if (userInfo[imageType] === undefined ) {
        // Initial upload
        userInfo[imageType] = [uploadResult.uri]
      } else {
        userInfo[imageType].push(uploadResult.uri)
      }
      await putItem("pet-app-userInfo", userInfo)
      return uploadResult.uri
    }
  }
}

const typeDefs = gql`
  extend type Mutation {
    uploadImage(
      image: Upload,
      imageType: String
    ): String
  }
`

module.exports = {
  typeDefs,
  resolvers
}
const { gql, AuthenticationError, ValidationError } = require('apollo-server')
const awsConfig = require('../../aws/aws-config.json')

// AWS actions
const upload = require('../../aws/upload')
const putItem = require('../../aws/putItem')

const typeDefs = gql`
  extend type Mutation {
    uploadImage(
      image: Upload!,
      imageType: String!
    ): Image
  }
  scalar Upload
`

const resolvers = {
  Mutation: {
    uploadImage: async (root, args, context) => {
      if (!context.user) throw new AuthenticationError("Please provide authorization")
      const {image, imageType} = args
      if (imageType !== "profilePicture" && imageType !== "images") throw new ValidationError (`imageType must be 'profilePicture' or 'images', received '${imageType}'`)

      const profileInfo = {
        "username": context.user.username,
        "description": context.user.description,
        "firstName": context.user.firstName,
        "lastName": context.user.lastName,
        "images": context.user.images,
        "profilePicture": context.user.profilePicture
      }
      const folder = `users/${profileInfo.username}/image/${imageType}/`

      // Upload picture to s3
      const uploadResult = await upload(image, folder, awsConfig.ImageBucketName)
      const imageInfo = {
        imageType: imageType,
        created: Date.now().toString(),
        uri: uploadResult.uri
      }

      // Update dynamodb for the uri
      if (profileInfo[imageType] === undefined ) {
        // Initial upload
        profileInfo[imageType] = [imageInfo]
      } else {
        // To insert the info into index 0, not deleting any data
        profileInfo[imageType].splice(0, 0, imageInfo)
      }
      await putItem(awsConfig.DynamoDBProfileTable, profileInfo)
      return imageInfo
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
const { gql } = require('apollo-server')
const aws = require('aws-sdk');
const { v4: uuid } = require('uuid');
const { extname } = require('path');

const s3 = new aws.S3({
  // endpoint: spacesEndpoint,
  params: {
    ACL: 'public-read',
    Bucket: 'pet-app',
  },
});

const upload = async (file, folder) => {
  if(!file) return null;
  const { createReadStream, filename, mimetype, encoding } = await file;

  try {
    const { Location } = await s3.upload({ 
      Body: createReadStream(),
      Key: `${folder}${uuid()}${extname(filename)}`,
      ContentType: mimetype
    }).promise();

    return {
      filename,
      mimetype,
      encoding,
      uri: Location, 
    }; 
  } catch(e) {
    console.log(e);
    return { error: { msg: `Error uploading file - ${e}` }};
  }
}

const resolvers = {
  Mutation: {
    uploadImage: async (root, args, context) => {
      const {image} = args
      // Hardcoded user
      const folder = `users/username/image/profile/`
      const uploadResult = await upload(image, folder)
      console.log(uploadResult);
      return uploadResult.uri
    }
  }
}

const typeDefs = gql`
  extend type Mutation {
    uploadImage(image: Upload): String
  }
`

module.exports = {
  typeDefs,
  resolvers
}
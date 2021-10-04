const aws = require('aws-sdk');
const { v4: uuid } = require('uuid');
const { extname } = require('path');

const upload = async (file, folder, bucket) => {
  if(!file) return null;
  const { createReadStream, filename, mimetype, encoding } = await file;

  const s3 = new aws.S3({
    // endpoint: spacesEndpoint,
    params: {
      ACL: 'public-read',
      Bucket: bucket,
    },
  });

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

module.exports = upload

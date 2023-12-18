const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

async function uploadBase64Image(base64Image) {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    },
    region: 'ap-south-1',
  });

  const decodedImage = Buffer.from(base64Image, 'base64');

  const uploadParams = {
    Bucket: 'contactsimg',
    Key: `image_${Date.now()}.png`,
    Body: decodedImage,
    ACL: 'public-read',
  };

  try {
    const data = await s3.send(new PutObjectCommand(uploadParams));
    const imageUrl = `https://contactsimg.s3.ap-south-1.amazonaws.com/${uploadParams.Key}`;
    return imageUrl; // Return the uploaded image URL
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = uploadBase64Image;

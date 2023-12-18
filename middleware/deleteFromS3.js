const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  },
  region: 'ap-south-1',
});

async function deleteFromS3(imageUrl) {
  try {
    // Extract the object key from the image URL (assuming the URL format is consistent)
    const urlParts = imageUrl.split('/');
    const objectKey = urlParts[urlParts.length - 1]; // Extract the last part of the URL as the object key

    const params = {
      Bucket: 'contactsimg',
      Key: objectKey,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    console.log('Object deleted successfully from S3');
  } catch (error) {
    console.error('Error deleting object from S3:', error);
    throw error;
  }
}

module.exports = deleteFromS3;

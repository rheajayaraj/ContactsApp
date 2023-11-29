const {
  S3Client,
  GetObjectCommand,
  GetObjectCommandOutput,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const multerS3 = require('multer-s3');
const multer = require('multer');

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  },
  region: 'ap-south-1',
});

const s3Storage = multerS3({
  s3: s3,
  bucket: 'contactsimg',
  acl: 'public-read',
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileName = Date.now() + '_' + file.originalname;
    cb(null, fileName);
  },
});

function sanitizeFile(file, cb) {
  const fileExts = ['.png', '.jpg', '.jpeg', '.gif'];
  const isAllowedExt = fileExts.includes(
    file.originalname.toLowerCase().slice(-4)
  );
  const isAllowedMimeType = file.mimetype.startsWith('image/');

  if (isAllowedExt && isAllowedMimeType) {
    return cb(null, true);
  } else {
    cb('Error: File type not allowed!');
  }
}

const uploadImage = multer({
  storage: s3Storage,
  fileFilter: (req, file, callback) => {
    sanitizeFile(file, callback);
  },
  limits: {
    fileSize: 1024 * 1024 * 2, // 2mb file size
  },
}).single('image');

// Generate a pre-signed URL for the uploaded file
module.exports = async (req, res, next) => {
  try {
    uploadImage(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ message: err });
      }

      const params = {
        Bucket: 'contactsimg',
        Key: req.file.key,
        Expires: 3600, // Expiration time for the pre-signed URL in seconds (e.g., 1 hour)
      };

      const command = new GetObjectCommand(params);
      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

      req.file.signedUrl = signedUrl; // Save the signed URL in req.file.signedUrl
      next(); // Move to the next middleware (e.g., the controller)
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

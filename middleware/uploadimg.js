const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
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
    fileSize: 1024 * 1024 * 8,
  },
}).single('image');

module.exports = async (req, res, next) => {
  try {
    uploadImage(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err });
      }
      if (req.file) {
        req.file.objectKey = req.file.key;
        next();
      } else {
        return res.status(400).json({ message: 'File key not found' });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const multer = require('multer');
const { User } = require('../../models/user');
const decrypt = require('../../middleware/saltdecrypt');
const verify = require('../../middleware/jwtverify');
const uploadImage = require('../../middleware/uploadimg');
const deleteFromS3 = require('../../middleware/deleteFromS3');

module.exports = async (req, res) => {
  if (req.body.image) {
    try {
      uploadImage(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: err.message });
        } else if (err) {
          return res.status(400).json({ message: err });
        }
        decryptedData = await decrypt(req.headers.authorization);
        const decoded = await verify(decryptedData);
        const user = await User.findById(decoded.id);
        if (user) {
          let imageData = '';
          if (req.file && req.file.objectKey) {
            imageData = req.file.objectKey;
            if (user.image) {
              await deleteFromS3(user.image);
            }
          }
          user.name = req.body.name || user.name;
          user.contact = req.body.contact || user.contact;
          user.email = req.body.email || user.email;
          user.image = imageData || user.image;
          const updatedUser = await user.save();
          res.status(200).json(updatedUser);
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  } else {
    try {
      decryptedData = await decrypt(req.headers.authorization);
      const decoded = await verify(decryptedData);
      const user = await User.findById(decoded.id);
      if (user) {
        user.name = req.body.name || user.name;
        user.contact = req.body.contact || user.contact;
        user.email = req.body.email || user.email;
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
};

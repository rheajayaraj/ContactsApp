const multer = require('multer');
const { User } = require('../../models/user');
const decrypt = require('../../middleware/saltdecrypt');
const verify = require('../../middleware/jwtverify');
const uploadImage = require('../../middleware/uploadimg');
const deleteFromS3 = require('../../middleware/deleteFromS3');

module.exports = async (req, res) => {
  try {
    decryptedData = await decrypt(req.headers.authorization);
    const decoded = await verify(decryptedData);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.body.image) {
      uploadImage(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: err.message });
        } else if (err) {
          return res.status(400).json({ message: err });
        }
        if (req.file && req.file.objectKey) {
          if (user.image) {
            await deleteFromS3(user.image);
          }
          user.image = req.file.objectKey;
        }
        user.name = req.body.name || user.name;
        user.contact = req.body.contact || user.contact;
        user.email = req.body.email || user.email;
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
      });
    } else {
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
};

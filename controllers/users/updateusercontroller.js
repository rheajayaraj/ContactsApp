const multer = require('multer');
const { User } = require('../../models/user');
const decrypt = require('../../middleware/saltdecrypt');
const verify = require('../../middleware/jwtverify');
const uploadImage = require('../../middleware/uploadimg');

const updateProfile = async (req, res) => {
  try {
    uploadImage(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err });
      }

      decryptedData = await decrypt(req.header.authorization);
      const decoded = await verify(decryptedData);
      const user = await User.findById(decoded.id);

      if (user) {
        let imageData = '';
        if (req.file && req.file.signedUrl) {
          imageData = req.file.signedUrl;
        }

        // Update user information
        user.name = req.body.name;
        user.contact = req.body.contact;
        user.email = req.body.email;
        user.image = imageData; // Assign the signed URL to the 'image' property

        try {
          await user.save();
          res
            .status(200)
            .json({ message: 'User details updated successfully' });
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = updateProfile;

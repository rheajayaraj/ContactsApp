const multer = require('multer');
const Contacts = require('../../models/contact');
const { User } = require('../../models/user');
const decrypt = require('../../middleware/saltdecrypt');
const verify = require('../../middleware/jwtverify');
const uploadImage = require('../../middleware/uploadimg');

module.exports = async (req, res) => {
  try {
    // Using uploadImage middleware
    uploadImage(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err });
      }

      decryptedData = await decrypt(req.body.JWT_token);
      const decoded = await verify(decryptedData);
      const user = await User.findById(decoded.id);

      if (user) {
        // The signed URL is retrieved from req.file.signedUrl
        let imageData = '';
        if (req.file && req.file.signedUrl) {
          imageData = req.file.signedUrl;
        }
        const data = new Contacts({
          name: req.body.name,
          contact: req.body.contact,
          email: req.body.email,
          tags: req.body.tags,
          user_id: user.id,
          image: imageData, // Assign the signed URL to the 'image' property
        });

        try {
          const dataToSave = await data.save();
          res.status(200).json(dataToSave);
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

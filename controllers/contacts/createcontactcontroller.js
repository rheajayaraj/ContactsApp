const multer = require('multer');
const Contacts = require('../../models/contact');
const { User } = require('../../models/user');
const decrypt = require('../../middleware/saltdecrypt');
const verify = require('../../middleware/jwtverify');
const uploadImage = require('../../middleware/uploadimg');

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
        console.log(decryptedData);
        const decoded = await verify(decryptedData);
        console.log(decoded);
        const user = await User.findById(decoded.id);
        if (user) {
          let imageData = '';
          if (req.file && req.file.objectKey) {
            imageData = req.file.objectKey;
          }
          const data = new Contacts({
            name: req.body.name,
            contact: req.body.contact,
            email: req.body.email,
            tags: req.body.tags,
            user_id: user.id,
            image: imageData,
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
  } else {
    try {
      decryptedData = await decrypt(req.headers.authorization);
      console.log(decryptedData);
      const decoded = await verify(decryptedData);
      console.log(decoded);
      const user = await User.findById(decoded.id);
      if (user) {
        const data = new Contacts({
          name: req.body.name,
          contact: req.body.contact,
          email: req.body.email,
          tags: req.body.tags,
          user_id: user.id,
        });
        try {
          const dataToSave = await data.save();
          res.status(200).json(dataToSave);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
};

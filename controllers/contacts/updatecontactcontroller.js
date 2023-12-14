const multer = require('multer');
const Contacts = require('../../models/contact');
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
          const contactId = req.params.contact;
          let contact = await Contacts.findById(contactId);
          if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
          }
          let imageData = '';
          if (req.file && req.file.objectKey) {
            imageData = req.file.objectKey;
            if (contact.image) {
              await deleteFromS3(contact.image);
            }
          }
          contact.name = req.body.name || contact.name;
          contact.contact = req.body.contact || contact.contact;
          contact.email = req.body.email || contact.email;
          contact.tags = req.body.tags || contact.tags;
          contact.image = imageData || contact.image;
          const updatedContact = await contact.save();
          res.status(200).json(updatedContact);
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
        const contactId = req.params.contact;
        let contact = await Contacts.findById(contactId);
        if (!contact) {
          return res.status(404).json({ message: 'Contact not found' });
        }
        contact.name = req.body.name || contact.name;
        contact.contact = req.body.contact || contact.contact;
        contact.email = req.body.email || contact.email;
        contact.tags = req.body.tags || contact.tags;
        const updatedContact = await contact.save();
        res.status(200).json(updatedContact);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
};

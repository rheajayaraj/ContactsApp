const multer = require('multer');
const Contacts = require('../../models/contact');
const { User } = require('../../models/user');
const decrypt = require('../../middleware/saltdecrypt');
const verify = require('../../middleware/jwtverify');
const uploadImage = require('../../middleware/uploadimg');
const deleteFromS3 = require('../../middleware/deleteFromS3'); // Function to delete from S3

module.exports = async (req, res) => {
  try {
    // Using uploadImage middleware
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
        const contactId = req.params.contact; // Get the contact ID from the request

        // Find the contact by ID
        let contact = await Contacts.findById(contactId);

        if (!contact) {
          return res.status(404).json({ message: 'Contact not found' });
        }

        // Check if a new image is uploaded
        let imageData = '';
        if (req.file && req.file.objectKey) {
          imageData = req.file.objectKey;

          // Delete the existing image from S3 if it exists
          if (contact.image) {
            await deleteFromS3(contact.image);
          }
        }

        // Update contact details including the new image URL
        contact.name = req.body.name || contact.name;
        contact.contact = req.body.contact || contact.contact;
        contact.email = req.body.email || contact.email;
        contact.tags = req.body.tags || contact.tags;
        contact.image = imageData || contact.image; // Preserve existing image if no new image

        // Save the updated contact
        const updatedContact = await contact.save();

        res.status(200).json(updatedContact);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

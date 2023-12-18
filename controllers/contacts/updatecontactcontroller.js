const Contacts = require('../../models/contact');
const { User } = require('../../models/user');
const decrypt = require('../../middleware/saltdecrypt');
const verify = require('../../middleware/jwtverify');
const uploadBase64Image = require('../../middleware/uploadimg');
const deleteFromS3 = require('../../middleware/deleteFromS3');

module.exports = async (req, res) => {
  try {
    // Decrypt and verify user
    decryptedData = await decrypt(req.headers.authorization);
    const decoded = await verify(decryptedData);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const contactId = req.params.contact;
    let contact = await Contacts.findById(contactId);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Check if an image is being updated
    if (req.body.image) {
      try {
        const updatedImageUrl = await uploadBase64Image(req.body.image);

        if (contact.image) {
          await deleteFromS3(contact.image);
        }

        // Update contact with new data
        contact.name = req.body.name || contact.name;
        contact.contact = req.body.contact || contact.contact;
        contact.email = req.body.email || contact.email;
        contact.tags = req.body.tags || contact.tags;
        contact.image = updatedImageUrl;

        const updatedContact = await contact.save();
        res.status(200).json(updatedContact);
      } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Failed to upload image' });
      }
    } else {
      // Update contact without changing the image
      contact.name = req.body.name || contact.name;
      contact.contact = req.body.contact || contact.contact;
      contact.email = req.body.email || contact.email;
      contact.tags = req.body.tags || contact.tags;

      const updatedContact = await contact.save();
      res.status(200).json(updatedContact);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

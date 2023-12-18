const Contacts = require('../../models/contact');
const { User } = require('../../models/user');
const decrypt = require('../../middleware/saltdecrypt');
const verify = require('../../middleware/jwtverify');
const uploadBase64Image = require('../../middleware/uploadimg');

module.exports = async (req, res) => {
  try {
    let imageUrl = '';
    if (req.body.image) {
      imageUrl = await uploadBase64Image(req.body.image);
    }
    decryptedData = await decrypt(req.headers.authorization);
    const decoded = await verify(decryptedData);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const contactData = {
      name: req.body.name,
      contact: req.body.contact,
      email: req.body.email,
      tags: req.body.tags,
      user_id: user.id,
      image: imageUrl,
    };
    const newContact = new Contacts(contactData);
    const savedContact = await newContact.save();
    res.status(200).json(savedContact);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

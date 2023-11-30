const Contacts = require('../../models/contact');
const { User } = require('../../models/user');
const decrypt = require('../../middleware/saltdecrypt');
const verify = require('../../middleware/jwtverify');

module.exports = async (req, res) => {
  try {
    decryptedData = await decrypt(req.body.JWT_token);
    const decoded = await verify(decryptedData);
    const user = await User.findById(decoded.id);
    if (user) {
      const contacts = await Contacts.find({ user_id: user.id });
      let tagsSet = new Set();
      contacts.forEach((contact) => {
        contact.tags.forEach((tag) => {
          tagsSet.add(tag);
        });
      });
      const uniqueTags = [...tagsSet];
      if (uniqueTags.length > 0) {
        res.json(uniqueTags);
      } else {
        res.json({ message: 'No contacts found with the specified tag' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

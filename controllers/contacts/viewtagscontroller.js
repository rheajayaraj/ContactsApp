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
      const tags = await Contacts.aggregate([
        {
          $match: { user_id: user.id },
        },
        {
          $unwind: '$tags',
        },
        {
          $group: {
            _id: null,
            uniqueTags: { $addToSet: '$tags' },
          },
        },
      ]);
      if (tags.length > 0 && tags[0].uniqueTags.length > 0) {
        res.json(tags[0].uniqueTags);
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

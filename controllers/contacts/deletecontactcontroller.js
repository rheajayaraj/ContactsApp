const Contacts = require('../../models/contact');
const { User, validate } = require('../../models/user');
const decrypt = require('../../middleware/saltdecrypt');
const verify = require('../../middleware/jwtverify');
const deleteFromS3 = require('../../middleware/deleteFromS3');

module.exports = async (req, res) => {
  try {
    decryptedData = await decrypt(req.headers.authorization);
    console.log(decryptedData);
    const decoded = await verify(decryptedData);
    console.log(decoded);
    const user = await User.findById(decoded.id);
    if (user) {
      const contact = req.params.id;
      const data = await Contacts.findByIdAndDelete(contact);
      if (data.image) {
        await deleteFromS3(contact.image);
      }
      res.json({ message: `Contact ${data.name} has been deleted` });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

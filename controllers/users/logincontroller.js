const { User, validate } = require('../../models/user');
const encrypt = require('../../middleware/saltencrypt');
const create = require('../../middleware/jwtcreate');

module.exports = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "User doesn't exist" });
    }

    const isPasswordValid = req.body.password === user.password;
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Password doesn't match" });
    }
    let token = await create({ id: user.id, email: user.email });
    let encryptedData = await encrypt(token);
    res.json({
      message: 'Authentication successful',
      user: user,
      JWT_token: encryptedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' }); // Change status code if needed
  }
};

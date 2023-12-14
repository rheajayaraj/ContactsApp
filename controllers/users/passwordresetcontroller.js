const { User } = require('../../models/user');
const Joi = require('joi');
const crypto = require('crypto');
const decrypt = require('../../middleware/saltdecrypt');

module.exports = async (req, res) => {
  try {
    const schema = Joi.object({
      password: Joi.string().required(),
      otp: Joi.string().required(),
      encrypt: Joi.string().required(),
      email: Joi.string().email().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const decryptedData = await decrypt(req.body.encrypt);
    const data = JSON.parse(decryptedData);
    console.log('Decrypted JSON:', data);
    const currentTimestamp = new Date().getTime();
    const otpTimestamp = new Date(data.timestamp).getTime();
    const oneHour = 60 * 60 * 1000;
    if (
      data.otp === req.body.otp &&
      currentTimestamp < otpTimestamp + oneHour
    ) {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      user.password = req.body.password;
      await user.save();
      return res.json({ success: 'Password reset successfully.' });
    } else {
      return res.status(400).json({ error: 'Invalid OTP or expired.' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while processing your request' });
  }
};

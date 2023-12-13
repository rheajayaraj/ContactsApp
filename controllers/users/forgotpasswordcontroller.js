const { User } = require('../../models/user');
const SENDMAIL = require('../../utils/sendemail');
const encrypt = require('../../middleware/saltencrypt');
const Joi = require('joi');
const speakeasy = require('speakeasy');

module.exports = async (req, res) => {
  try {
    // const schema = Joi.object({ email: Joi.string().email().required() });
    // const { error } = schema.validate(req.body);
    //if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(400)
        .json({ error: "User with given email doesn't exist" });

    const secret = speakeasy.generateSecret({ length: 20 });
    const code = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });

    const timestamp = new Date();
    const jsonData = { otp: code, timestamp: timestamp };
    console.log(jsonData);
    const jsonDataString = JSON.stringify(jsonData);
    let encryptedData = await encrypt(jsonDataString);

    const emailOptions = {
      from: '<rheajayaraj1@gmail.com>',
      to: user.email,
      subject: 'Password reset',
      text: `OTP: ${code}`,
    };
    await SENDMAIL(emailOptions);
    res.json({
      success: 'Password reset link sent to your email account',
      otp: code,
      encrypt: encryptedData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while processing your request' });
  }
};

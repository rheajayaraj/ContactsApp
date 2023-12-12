const { User, validate } = require('../../models/user');
module.exports = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ error: 'That user already exisits!' });
  } else {
    data = new User({
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      password: req.body.password,
    });
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  }
};

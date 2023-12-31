const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  contact: {
    minlength: 10,
    maxlength: 10,
    required: true,
    type: String,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  image: {
    type: String,
    required: false,
  },
});

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    contact: Joi.string().min(10).max(10).required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(user);
}

module.exports = {
  User: mongoose.model('User', userSchema),
  validate: validateUser,
};

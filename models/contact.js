const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  contact: {
    required: true,
    type: String,
  },
  tags: {
    type: [String],
    required: false,
  },
  user_id: {
    required: true,
    type: String,
  },
  image: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('Contact', contactSchema);

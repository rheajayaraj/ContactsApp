const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    contact: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    user_id: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Contact', contactSchema)

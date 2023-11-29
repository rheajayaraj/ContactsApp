const Contacts = require('../../models/contact');
module.exports=async (req, res) => {
    const data = new Contacts({
        name: req.body.name,
        contact: req.body.contact,
        email: req.body.email
    })
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
}
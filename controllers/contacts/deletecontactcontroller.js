const Contacts = require('../../models/contact');
module.exports=async (req, res) => {
    try {
        const name = req.params.name;
        const data = await Contacts.findOneAndDelete({name: name})
        res.send(`Contact ${data.name} has been deleted`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}
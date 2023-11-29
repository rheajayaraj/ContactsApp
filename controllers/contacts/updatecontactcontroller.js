const Contacts = require('../../models/contact');
module.exports=async (req, res) => {
    try {
        const name = req.params.name;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Contacts.findOneAndUpdate(
            {name: name}, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}
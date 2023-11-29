const Contacts = require('../../models/contact');
module.exports=async (req, res) => {
    try{
        const data = await Contacts.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}
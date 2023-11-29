const Contacts = require('../../models/contact');
module.exports=async (req, res) => {
    try{
        const data = await Contacts.findOne({name: req.params.name});
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}
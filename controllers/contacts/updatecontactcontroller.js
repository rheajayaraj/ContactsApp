const Contacts = require('../../models/contact');
const { User, validate } = require('../../models/user');
const decrypt=require('../../middleware/saltdecrypt')
const verify=require('../../middleware/jwtverify')

module.exports=async (req, res) => {
    try {
        decryptedData=await decrypt(req.body.JWT_token)
        console.log(decryptedData)
        const decoded = await verify(decryptedData)
        console.log(decoded)
        const user = await User.findById(decoded.id)
        if (user){
            const contact = req.params.contact;
            const updatedData = {name:req.body.name, contact:req.body.contact, email:req.body.email, tags:req.body.tags};
            const options = { new: true };
            const contactv = await Contacts.findOne({contact:contact})
            if (contactv.user_id==user.id){
                const result = await Contacts.findOneAndUpdate(
                    {contact: contact}, updatedData, options
                )
                res.json({message: "Contact Updated"})
            }
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}
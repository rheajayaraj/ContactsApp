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
            const contact = req.body.contact;
            const data = await Contacts.findOneAndDelete({contact: contact, user_id: user.id})
            res.json({message:`Contact ${data.name} has been deleted`})
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}
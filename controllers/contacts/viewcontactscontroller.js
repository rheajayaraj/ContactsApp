const Contacts = require('../../models/contact');
const { User, validate } = require('../../models/user');
const decrypt=require('../../middleware/saltdecrypt')
const verify=require('../../middleware/jwtverify')

module.exports=async (req, res) => {
    try{
        decryptedData=await decrypt(req.body.JWT_token)
        console.log(decryptedData)
        const decoded = await verify(decryptedData)
        console.log(decoded)
        const user = await User.findById(decoded.id)
        if (user){
            const data = await Contacts.find({user_id: user.id});
            res.json(data)
        }
        else{
            res.json({message: 'Contact not available'})
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}
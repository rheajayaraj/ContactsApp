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
            const data = new Contacts({
                name: req.body.name,
                contact: req.body.contact,
                email: req.body.email,
                tags: req.body.tags,
                user_id: user.id
            })
            try {
                const dataToSave = await data.save();
                res.status(200).json(dataToSave)
            }
            catch (error) {
                res.status(400).json({message: error.message})
            }
        }
    } 
    catch(error){
        console.log(error)
    }
}
const Contacts = require('../../models/contact');
const { User } = require('../../models/user');
const decrypt = require('../../middleware/saltdecrypt');
const verify = require('../../middleware/jwtverify');

module.exports = async (req, res) => {
    try {
        decryptedData = await decrypt(req.body.JWT_token);
        
        const decoded = await verify(decryptedData);
        console.log(decoded);
        
        const user = await User.findById(decoded.id);
        if (user) {
            const cons = await Contacts.find({ user_id: user.id });
            let data = [];
            
            cons.forEach(contact => {
                contact.tags.forEach(tag => {
                    if (tag === req.body.tag) {
                        data.push(contact.name);
                    }
                });
            });

            if (data.length > 0) {
                res.json(data);
            } else {
                res.json({ message: 'No contacts found with the specified tag' });
            }
        } 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

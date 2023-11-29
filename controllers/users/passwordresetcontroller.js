const { User } = require("../../models/user");
const Joi = require("joi");
const crypto = require("crypto");

module.exports = async (req, res) => {
    try {
        const schema = Joi.object({ 
            password: Joi.string().required(),
            otp: Joi.string().required(),
            encrypt: Joi.string().required()
        });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const secretKey = 'Password';
        const salt = 'Reset'; 
        const key = crypto.scryptSync(secretKey, salt, 32); 
        const iv = Buffer.from('26c5c981d12e7a23b21cb128ac3fbd69', 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        const decryptedData = decipher.update(req.body.encrypt, 'hex', 'utf8') + decipher.final('utf8');
            const data = JSON.parse(decryptedData);
            console.log('Decrypted JSON:', data);
        const currentTimestamp = new Date().getTime();
        const otpTimestamp = new Date(data.timestamp).getTime();
        const oneHour = 60 * 60 * 1000; // One hour in milliseconds

        if (data.otp === req.body.otp && currentTimestamp < otpTimestamp + oneHour) {
            // Reset the user's password and delete the token
            const user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            user.password = req.body.password;
            await user.save();

            return res.json({ success: "Password reset successfully." });
        } else {
            return res.status(400).json({ error: "Invalid OTP or expired." });
        }
    } catch (error) {
        console.error("Error:", error); // Log the specific error for debugging
        return res.status(500).json({ error: "An error occurred while processing your request" });
    }
};

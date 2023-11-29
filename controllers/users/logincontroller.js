const { User, validate } = require('../../models/user');
const jwt = require('jsonwebtoken'); // Import the JWT module if not already done

module.exports = async function(req, res){ 
    try { 
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const user = await User.findOne({ email: req.body.email }); 
        if (!user) { 
            return res.status(400).json({ error: "User doesn't exist" });
        }

        const isPasswordValid = req.body.password === user.password; 
        if (!isPasswordValid) { 
            return res.status(400).json({ error: "Password doesn't match" }); 
        }

        // Generate and send JWT if authentication is successful
        const jwtSecretKey = process.env.JWT_SECRET_KEY; 
        const token = jwt.sign({ id: user._id, email: user.email }, jwtSecretKey); 
        res.json({ message: "Authentication successful", user: user, JWT_token: token});
    } catch (error) { 
        res.status(500).json({ error: "Internal server error" }); // Change status code if needed
    } 
};

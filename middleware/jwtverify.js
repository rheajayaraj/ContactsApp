const jwt = require("jsonwebtoken");

const verify=async(data)=>{
    const decoded = jwt.verify(decryptedData, process.env.JWT_SECRET_KEY)
    return decoded
}

module.exports=verify
const crypto = require('crypto');

const encrypt = async (data) => {
  const hexiv = process.env.iv;
  const key = crypto.scryptSync(process.env.secretKey, process.env.salt, 32);
  const iv = Buffer.from(hexiv, 'hex');
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encryptedData = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
  return encryptedData;
};

module.exports = encrypt;

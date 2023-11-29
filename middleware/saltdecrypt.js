const crypto = require('crypto');

const decrypt = async (data) => {
  const hexiv = process.env.iv;
  const key = crypto.scryptSync(process.env.secretKey, process.env.salt, 32);
  const iv = Buffer.from(hexiv, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decryptedData =
    decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
  return decryptedData;
};

module.exports = decrypt;

const crypto = require('crypto');

// JSON data to encrypt
const jsonData = { name: 'Alice', age: 30, email: 'alice@example.com' };
const jsonDataString = JSON.stringify(jsonData);
const secretKey = 'MySuperSecretKey'; // Replace with your secret key
const salt = 'MyRandomSalt123'; // Replace with a random salt
const key = crypto.scryptSync(secretKey, salt, 32); // 32 is the key length
const iv = Buffer.from('26c5c981d12e7a23b21cb128ac3fbd69', 'hex');
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
let encryptedData = cipher.update(jsonDataString, 'utf8', 'hex');
encryptedData += cipher.final('hex');

// Output the encrypted data and IV
console.log('Encrypted Data:', encryptedData);
console.log('Initialization Vector (IV):', iv.toString('hex'));

// Create a decipher using the same algorithm, key, and IV
const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

// Decrypt the data
let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
decryptedData += decipher.final('utf8');

// Parse the decrypted data back to JSON
const originalJSON = JSON.parse(decryptedData);

console.log('Decrypted JSON:', originalJSON);


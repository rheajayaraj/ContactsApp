const jwt = require('jsonwebtoken');

const create = async (data) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(data, jwtSecretKey);
  return token;
};

module.exports = create;

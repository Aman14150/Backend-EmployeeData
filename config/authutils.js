const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generatePassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  return token;
};

const verifyToken = (token) => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  return decodedToken;
};

module.exports = {
  generatePassword,
  comparePassword,
  generateToken,
  verifyToken,
};

const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

const generateApiKey = async (userId) => {
  const apiKey = require('crypto').randomBytes(32).toString('hex');
  await User.update({ apiKey }, { where: { id: userId } });
  return apiKey;
};

module.exports = { authenticateJWT, generateApiKey };

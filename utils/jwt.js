const jwt = require('jsonwebtoken');

const { SECRET_JWT } = require('./constants');

const signToken = (id) => {
  try {
    const token = jwt.sign({ id }, SECRET_JWT, { expiresIn: '7d' });
    return token;
  } catch (e) {
    return false;
  }
};

module.exports = {
  signToken,
};

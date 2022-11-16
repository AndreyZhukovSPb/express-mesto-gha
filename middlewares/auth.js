const jwt = require('jsonwebtoken');

const { SECRET_JWT } = require('../utils/constants');

const User = require('../models/user');

// const { AccessError } = require('../utils/errors/AccessError');

const { DataError } = require('../utils/errors/DataError');

const tokenAuth = (req, res, next) => {
  const token = req.headers.authorization;
  // if (!token || token === '') { return res.status(401).send({ message: 'пустой токен' }); }
  if (!token || token === '') { throw new DataError('пустой токен'); }
  try {
    const result = jwt.verify(token, SECRET_JWT);
    // console.log(result);
    User.findOne({ _id: result.id }).then((user) => {
      // if (!user) { return res.status(401).send({ message: 'нет прав' }); }
      // if (!user) { throw new AccessError('нет прав'); }
      req.user = {
        _id: result.id,
      };
      // console.log(req.user._id);
      return next();
    });
  } catch (err) {
    next(err);
    // return res.status(401).send({ message: 'ошибка проверки токена' });
  }
};

module.exports = {
  tokenAuth,
};
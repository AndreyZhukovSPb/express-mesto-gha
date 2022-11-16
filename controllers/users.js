const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
// const { ALERTS } = require('../utils/constants');
const { signToken } = require('../utils/jwt');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const { DataError } = require('../utils/errors/DataError');
const { LogError } = require('../utils/errors/LogError');
const { AccessError } = require('../utils/errors/AccessError');

const getUser = (req, res, next) => {
  console.log(req.params);
  User.findOne({ _id: req.user._id })
    .then((user) => {
      // if (!user) { return res.status(403).send({ message: 'пользователь не найден' }); }
      if (!user) { throw new NotFoundError('Нет пользователя с таким id'); }
      return res.status(200).send(user);
    })
    .catch((err) => {
      // if (err instanceof mongoose.Error.ValidationError) {
      //  next(new NotFoundError('провекрка catch'));
        // return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
      // }
      // next(new NotFoundError('провекрка catch 2'));
      // return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
      next(err);
    });
};

const createUser = (req, res, next) => {
  if (!req.body.password) { throw new LogError('ошибка в пароле'); }
  const hash = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hash;
  User.create(req.body)
    .then((user) => {
      res.send({
        _id: user.id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new DataError('указан некорректный email'));
        // return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
      }
      if (err.code === 11000) { next(new AccessError('пользовталеь с таким email уже зарегистрирован')); }
      // return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  // if (!email || !password) return res.status(ALERTS.CODES.OTHER).send({ message: 'отсутствуют логин или пароль' });
  if (!email || !password) { throw new DataError('отсутствует логин или пароль'); }
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) { throw new LogError('пользователь не найден'); }
      bcrypt.compare(password, user.password).then((match) => {
        // if (!match) { return res.status(ALERTS.CODES.OTHER).send({ message: 'пароль не подходит' }); }
        // if (!match) { throw new LogError('неверный пароль'); }
        if (!match) { return next(new LogError('указан некорректный пароль')); }
        const result = signToken(user._id);
        return res.send({ data: result });
      });
    })
    .catch(next);
    // .catch((err) => res.status(ALERTS.CODES.OTHER).send({ message: 'пользователь не найден' }));
};

const getUsers = (req, res, next) => User.find({})
  .then((users) => {
    res.send(users);
  })
  .catch((err) => {
    // if (err instanceof mongoose.Error.ValidationError) {
      // next(new LogError('указаны некорректные данные'));
      // return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
    // }
    next(err);
    // return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
  });

const getUserById = (req, res, next) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('пользователь не найден');
      // return res.status(ALERTS.CODES.PATH).send({ message: ALERTS.MESSAGES.PATH });
    }
    return res.send(user);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      next(new DataError('указаны некорректные данные'));
      // return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
    }
    next(err);
    // return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
  });

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new LogError('пользователь не найден');
        // return res.status(ALERTS.CODES.PATH).send({ message: ALERTS.MESSAGES.PATH });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new LogError('пользователь не найден'));
        // return res.status(ALERTS.CODES.PATH).send({ message: ALERTS.MESSAGES.PATH });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next(new DataError('указаны некорректные данные'));
        // return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
      }
      next(err);
      // return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
    });
};

const updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new LogError('пользователь не найден');
        // return res.status(ALERTS.CODES.PATH).send({ message: ALERTS.MESSAGES.PATH });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new LogError('пользователь не найден'));
        // return res.status(ALERTS.CODES.PATH).send({ message: ALERTS.MESSAGES.PATH });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next(new DataError('указаны некорректные данные'));
        // return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
      }
      next(err);
      // return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  login,
  getUser,
};

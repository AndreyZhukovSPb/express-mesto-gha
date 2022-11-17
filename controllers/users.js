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
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) { throw new NotFoundError('Нет пользователя с таким id'); }
      return res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
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
        return next(new DataError('указан некорректный email'));
      }
      if (err.code === 11000) { next(new AccessError('пользовталеь с таким email уже зарегистрирован')); }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) { throw new LogError('пользователь не найден'); }
      bcrypt.compare(password, user.password).then((match) => {
        if (!match) { return next(new LogError('указан некорректный пароль')); }
        const result = signToken(user._id);
        return res.send({ data: result });
      });
    })
    .catch(next);
};

const getUsers = (req, res, next) => User.find({})
  .then((users) => {
    res.send(users);
  })
  .catch((err) => {
    next(err);
  });

const getUserById = (req, res, next) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('пользователь не найден');
    }
    return res.send(user);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      return next(new DataError('указаны некорректные данные'));
    }
    return next(err);
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
        throw new NotFoundError('пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new NotFoundError('пользователь не найден'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new DataError('указаны некорректные данные'));
      }
      return next(err);
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
        throw new NotFoundError('пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new DataError('указаны некорректные данные'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next(new DataError('указаны некорректные данные'));
      }
      next(err);
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

/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const User = require('../models/user');

const createUser = (req, res) => User.create(req.body)
  .then((user) => {
    res.status(201).send(user);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: 'Переданы некорректные данные', err });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка', err });
  });

const getUsers = (req, res) => User.find({})
  .then((users) => {
    res.status(200).send(users);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: 'Переданы некорректные данные', err });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка', err });
  });

const getUserById = (req, res) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Запрашиваемый пользователь не найден', err });
    }
    return res.status(200).send(user);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: 'Переданы некорректные данные', err });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка', err });
  });

const updateUser = (req, res) => {
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
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден', err });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const updateUserAvatar = (req, res) => {
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
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
};

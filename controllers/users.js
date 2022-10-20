const mongoose = require('mongoose');
const User = require('../models/user');
const { ALERTS } = require('../utils/constants');

const createUser = (req, res) => User.create(req.body)
  .then((user) => {
    res.send(user);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
    }
    return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
  });

const getUsers = (req, res) => User.find({})
  .then((users) => {
    res.send(users);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
    }
    return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
  });

const getUserById = (req, res) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      return res.status(ALERTS.CODES.PATH).send({ message: ALERTS.MESSAGES.PATH });
    }
    return res.send(user);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
    }
    return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
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
      if (!user) {
        return res.status(ALERTS.CODES.PATH).send({ message: ALERTS.MESSAGES.PATH });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ALERTS.CODES.PATH).send({ message: ALERTS.MESSAGES.PATH });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
      }
      return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
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
      if (!user) {
        return res.status(ALERTS.CODES.PATH).send({ message: ALERTS.MESSAGES.PATH });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ALERTS.CODES.PATH).send({ message: ALERTS.MESSAGES.PATH });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
      }
      return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
};

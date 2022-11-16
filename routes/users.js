const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
// const mongoose = require('mongoose');
// const User = require('../models/user');

const {
  getUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUser);

router.get('/:userId', getUserById);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }).unknown(true),
  }),
  updateUser,
);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REGEX } = require('../utils/constants');

const {
  getUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUser);

router.get(
  '/:userId',
  celebrate({
    params: {
      userId: Joi.string().required().min(24).max(24),
    },
  }),
  getUserById,
);

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

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().min(2).max(30).regex(REGEX),
    }).unknown(true),
  }),
  updateUserAvatar,
);

module.exports = router;

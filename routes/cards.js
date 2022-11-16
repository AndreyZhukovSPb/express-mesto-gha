const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REGEX } = require('../utils/constants');

const {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().regex(REGEX).required(),
    }).unknown(true),
  }),
  createCard,
);

router.delete(
  '/:cardId',
  celebrate({
    params: {
      cardId: Joi.string().required().min(24).max(24),
    },
  }),
  deleteCardById,
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: {
      cardId: Joi.string().required().min(24).max(24),
    },
  }),
  likeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: {
      cardId: Joi.string().required().min(24).max(24),
    },
  }),
  dislikeCard,
);

module.exports = router;

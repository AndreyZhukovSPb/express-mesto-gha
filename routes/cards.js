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
      link: Joi.string().regex(REGEX),
    }).unknown(true),
  }),
  createCard,
);

router.delete(
  '/:cardId',
  celebrate({
    params: {
      cardId: Joi.number().required(),
    },
  }),
  deleteCardById,
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: {
      cardId: Joi.number().required(),
    },
  }),
  likeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: {
      cardId: Joi.number().required(),
    },
  }),
  dislikeCard,
);

module.exports = router;

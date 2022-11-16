const mongoose = require('mongoose');
const Card = require('../models/card');
// const { ALERTS } = require('../utils/constants');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const { RightsError } = require('../utils/errors/RightsError');
const { LogError } = require('../utils/errors/LogError');
const { AccessError } = require('../utils/errors/AccessError');

const createCard = (req, res, next) => {
  req.body.owner = req.user._id;
  Card.create(req.body)
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new LogError('указан некорректные данные'));
        // return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
      }
      next(err);
      // return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
    });
};

const getCards = (req, res, next) => Card.find({})
  .then((cards) => {
    res.send(cards);
  })
  .catch((err) => {
    // if (err instanceof mongoose.Error.ValidationError) {
    //  return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
    // }
    next(err);
    // return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
  });

const deleteCardById = (req, res, next) => Card.findById(req.params.cardId)
  .then((card) => {
    if (!card) { throw new NotFoundError('карточка не найдена'); }
    const ownerId = card.owner.toString();
    // if (!card) return res.status(ALERTS.CODES.PATH).send({ message: 'карточка не найдена' });

    // if (ownerId !== req.user._id) return res.status(403).send({ message: 'не твое - не трогай' });
    if (ownerId !== req.user._id) { throw new RightsError('нет прав для удаления'); }
    Card.findByIdAndRemove(req.params.cardId)
      .then((data) => {
        // if (!data) return res.status(ALERTS.CODES.PATH).send({ message: 'карточка не найдена' });
        if (!data) { return next(new LogError('карточка не найдена')); }
        return res.send(data);
      });
  })
  .catch((err) => {
    // console.log(err);
    if (err instanceof mongoose.Error.CastError) {
      // return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
      next(new LogError('переданы некорректные данные'));
    }
    next(err);
    // return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
  });

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('карточка не найдена');
        // return res.status(ALERTS.CODES.PATH).send({ message: ALERTS.MESSAGES.PATH });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new LogError('переданы некорректные данные'));
        // return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
      }
      next(err);
      // return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('карточка не найдена');
        // return res.status(ALERTS.CODES.PATH).send({ message: ALERTS.MESSAGES.PATH });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new LogError('переданы некорректные данные'));
        // return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
      }
      next(err);
      // return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};

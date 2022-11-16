const mongoose = require('mongoose');
const Card = require('../models/card');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const { RightsError } = require('../utils/errors/RightsError');
const { LogError } = require('../utils/errors/LogError');

const createCard = (req, res, next) => {
  req.body.owner = req.user._id;
  Card.create(req.body)
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new LogError('указан некорректные данные'));
      }
      next(err);
    });
};

const getCards = (req, res, next) => Card.find({})
  .then((cards) => {
    res.send(cards);
  })
  .catch((err) => {
    next(err);
  });

const deleteCardById = (req, res, next) => Card.findById(req.params.cardId)
  .then((card) => {
    if (!card) { throw new NotFoundError('карточка не найдена'); }
    const ownerId = card.owner.toString();
    if (ownerId !== req.user._id) { throw new RightsError('нет прав для удаления'); }
    Card.findByIdAndRemove(req.params.cardId)
      .then((data) => {
        if (!data) { return next(new LogError('карточка не найдена')); }
        return res.send(data);
      });
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      next(new LogError('переданы некорректные данные'));
    }
    next(err);
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
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new LogError('переданы некорректные данные'));
      }
      next(err);
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
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new LogError('переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};

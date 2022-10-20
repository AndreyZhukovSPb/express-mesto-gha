const mongoose = require('mongoose');
const Card = require('../models/card');
const { ALERTS } = require('../utils/constants');

const createCard = (req, res) => {
  req.body.owner = req.user._id;
  Card.create(req.body)
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
      }
      return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
    });
};

const getCards = (req, res) => Card.find({})
  .then((cards) => {
    res.send(cards);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
    }
    return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
  });

const deleteCardById = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if (!card) {
      return res.status(ALERTS.CODES.PATH).send({ message: ALERTS.MESSAGES.PATH });
    }
    return res.send(card);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
    }
    return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
  });

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ALERTS.CODES.PATH).send({ message: ALERTS.MESSAGES.PATH });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
      }
      return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ALERTS.CODES.PATH).send({ message: ALERTS.MESSAGES.PATH });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
      }
      return res.status(ALERTS.CODES.OTHER).send({ message: ALERTS.MESSAGES.OTHER });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};

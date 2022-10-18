/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const Card = require('../models/card');

const createCard = (req, res) => {
  req.body.owner = req.user._id;
  Card.create(req.body)
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const getCards = (req, res) => Card.find({})
  .then((cards) => {
    res.status(200).send(cards);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: 'Переданы некорректные данные', err });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка', err });
  });

const deleteCardById = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    res.status(201).send(card);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(404).send({ message: 'Запрашиваемая карточка не найдена', err });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка', err });
  });

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Переданы некорректные данные', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // eslint-disable-next-line no-underscore-dangle
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Переданы некорректные данные', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};

const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cardsRouter = require('./routes/users');
const userRouter = require('./routes/cards');
const { REGEX } = require('./utils/constants');
const { NotFoundError } = require('./utils/errors/NotFoundError');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const {
  createUser,
  login,
} = require('./controllers/users');

const { tokenAuth } = require('./middlewares/auth');

mongoose.connect(MONGO_URL, {});

const app = express();

app.use(express.json());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(REGEX),
    }),
  }),
  createUser,
);

app.use(tokenAuth);
app.use('/users', cardsRouter);
app.use('/cards', userRouter);

app.use((req, res, next) => {
  next(new NotFoundError('указаны некорректные данные'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
});

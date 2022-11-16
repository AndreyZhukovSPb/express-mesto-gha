const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cardsRouter = require('./routes/users');
const userRouter = require('./routes/cards');
const { ALERTS } = require('./utils/constants');

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
      email: Joi.string().required().min(2).max(30),
      password: Joi.string().required(),
    }).unknown(true),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(2).max(30), // и так можно?
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().min(2).max(30), // так можно?
    }).unknown(true),
  }),
  createUser,
);

app.use(tokenAuth);
app.use('/users', cardsRouter);
app.use('/cards', userRouter);

app.use(errors());

app.use((err, req, res, next) => {
  // console.log(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.use((req, res) => {
  res.status(ALERTS.CODES.PATH).send({ message: 'ALERTS.MESSAGES.PATH' });
});

app.listen(PORT, () => {
});

// линтером проверить
// срок токена 1 неделя сделать
// валидировать tokenAuth?

// createUser приходит пароль в респонсе почему то, на гетюзер нет

const express = require('express');

const mongoose = require('mongoose');

const cardsRouter = require('./routes/users');

const userRouter = require('./routes/cards');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(MONGO_URL, {});

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '634db892785dd87d9b429068',
  };
  next();
});

app.use(cardsRouter);
app.use(userRouter);

app.patch('*', (req, res) => {
  res.status(400).send({ message: 'Переданы некорректные данные' });
});

app.listen(PORT, () => {
});

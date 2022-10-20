const express = require('express');

const mongoose = require('mongoose');

const cardsRouter = require('./routes/users');

const userRouter = require('./routes/cards');

const { ALERTS } = require('./utils/constants');

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

app.use('/users', cardsRouter);
app.use('/cards', userRouter);

app.use((req, res) => {
  res.status(ALERTS.CODES.DATA).send({ message: ALERTS.MESSAGES.DATA });
});

app.listen(PORT, () => {
});

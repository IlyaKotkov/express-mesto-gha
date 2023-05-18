const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const cards = require('./routes/cards');
const routerError = require('./routes/router');
const { login, createUser } = require('./controllers/users');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', createUser);
app.use(users);
app.use(cards);
app.use(routerError);

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { status = 500, message } = err;

  res
    .status(status)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: status === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(3000);

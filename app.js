const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users.js')
const cards = require('./routes/cards.js')
const bodyParser = require('body-parser');
const NotFoundError = require('./errors/NotFoundError.js')

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.all('/*', () => {
  throw new NotFoundError('Запрошенная страница не найдена');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: "6455495ca375b7defafb54a5"
  }

  next()
})
app.use(users)
app.use(cards)

app.listen(3000);
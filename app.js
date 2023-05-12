const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const cards = require('./routes/cards');
const routerError = require('./routes/router');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '645bd9cfe2fdd2c7c31bb4bf',
  };

  next();
});
app.use(users);
app.use(cards);
app.use(routerError);

app.listen(3000);

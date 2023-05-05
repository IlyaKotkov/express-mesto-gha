const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users.js')
const cards = require('./routes/cards.js')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(users )
app.use(cards)
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: "6455495ca375b7defafb54a5"
  }

  next()
})

app.listen(3000);
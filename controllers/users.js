/* eslint-disable consistent-return */
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequesError = require('../errors/BadRequesError');
const existingEmail = require('../errors/existingEmail');

const updateUser = (req, res, data, next) => {
  User.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    .orFail(() => {
      const newError = new Error();
      newError.name = 'DocumentNotFoundError';
      throw newError;
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(
          'Пользователь по указанному id не найден.',
        );
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
      } else if (err.name === 'CastError') {
        next(new BadRequesError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(err);
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getUsersById = (req, res, next) => {
  const userId = req.params.userId ? req.params.userId : req.user._id;
  User.findById(userId)
    .orFail(() => {
      const newError = new Error();
      newError.name = 'DocumentNotFoundError';
      throw newError;
    })
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('пользователь не найден'));
      } else if (err.name === 'CastError') {
        next(new BadRequesError('передан некорректный id'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash, // записываем хеш в базу
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequesError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        // eslint-disable-next-line new-cap
        next(new existingEmail('Такой Email уже существует.'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  updateUser(req, res, { name, about });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUser(req, res, { avatar });
};

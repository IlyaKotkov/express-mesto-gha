const User = require('../models/user')
const NOT_FOUND_ERROR = 404
const BAD_REQUES_ERROR = 400
const DEFAULT_ERROR = 500

const updateUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(NOT_FOUND_ERROR).send({message: "Пользователь по указанному _id не найден."})
      } else if (err.name === "ValidationError") {
        res.status(BAD_REQUES_ERROR).send({message: "Переданы некорректные данные при обновлении профиля."})
      }
       else {
        res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' })
      }
    })
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
  .orFail(() => {
    const newError = new Error()
    newError.name = "DocumentNotFoundError"
    throw newError
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERROR).send({message: "Пользователь по указанному _id не найден."})
      } else if (err.name === "CastError") {
        res.status(BAD_REQUES_ERROR).send({message: "Передан некорректный _id."})
      }
      else {
        res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' })
      }

    } );
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUES_ERROR).send({message: "Переданы некорректные данные при создании пользователя."})
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' })
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  updateUser(req, res, req.user._id, { name, about });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUser(req, res, req.user._id, { avatar });
};
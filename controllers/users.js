const User = require('../models/user')

const updateUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send({message: "Пользователь по указанному _id не найден."})
      }
      if (err.name === "ValidationError") {
        res.status(400).send({message: "Переданы некорректные данные при обновлении профиля."})
      }
       else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    })
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
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
        res.status(404).send({message: "Пользователь по указанному _id не найден."})
      }

      if (err.name === "CastError") {
        res.status(400).send({message: "Передан некорректный _id."})
      }
        return res.status(500).send({ message: 'Произошла ошибка' })

    } );
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({message: "Переданы некорректные данные при создании пользователя."})
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
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
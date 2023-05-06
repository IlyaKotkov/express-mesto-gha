const User = require('../models/user')

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about})
  .then((user) => res.send({data: user}))
  .catch((err) => console.log(err))
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.user._id)
    .then(users => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar  })
    .then(user => res.send({ data: user}))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  updateUser(req, res, req.user._id, { name, about });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUser(req, res, req.user._id, { avatar });
};
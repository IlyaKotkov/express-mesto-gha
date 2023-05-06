const Card = require('../models/card')

module.exports.createCard = (req, res) => {
  const {name, link} = req.body
  const owner = req.user._id
  Card.create({ name, link, owner  })
  .then(cards => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getCard = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findById(req.params._id)
    .then(cards => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err }));
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
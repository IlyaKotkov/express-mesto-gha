const Card = require('../models/card')
const NOT_FOUND_ERROR = 404
const BAD_REQUES_ERROR = 400
const DEFAULT_ERROR = 500
const STATUS_OK = 200

module.exports.createCard = (req, res) => {
  const { name, link } = req.body
  const owner = req.user._id
  Card.create({ name, link, owner })
    .then(cards => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUES_ERROR).send({ message: "Переданы некорректные данные при создании карточки." })
      }
      else {
        res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' })
      }
    });
};

module.exports.getCard = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .orFail(() => {
    const newError = new Error()
    newError.name = "DocumentNotFoundError"
    throw newError
  })
    .then(card => res.send(card))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERROR).send({message: "карточка по указанному _id не найдена."})
      }
      else {
        res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' })
      }
      if (err.name === "CastError") {
        res.status(BAD_REQUES_ERROR).send({message: "Передан некорректный _id."})
      }
      else {
        res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' })
      }

    } );
};

module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR).send({ message: "Карточка с указанным _id не найдена." })
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BAD_REQUES_ERROR).send({ message: "Переданы некорректные данные для постановки лайка." })
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' })
      }
    })

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    if (!card) {
      res.status(NOT_FOUND_ERROR).send({ message: "Карточка с указанным _id не найдена." })
    }
      return res.status(200).send({ data: card });
  })
  .catch((err) => {
    if (err.name === "CastError") {
      res.status(BAD_REQUES_ERROR).send({ message: "Переданы некорректные данные для снятии лайка." })
    } else {
      res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' })
    }
  })
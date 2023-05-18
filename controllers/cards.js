const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');

const NOT_FOUND_ERROR = 404;
const BAD_REQUES_ERROR = 400;
const STATUS_OK = 200;

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUES_ERROR).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        next(err);
      }
    });
};

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const newError = new Error();
      newError.name = 'DocumentNotFoundError';
      throw newError;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR).send({ message: 'карточка по указанному _id не найдена.' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUES_ERROR).send({ message: 'Передан некорректный _id.' });
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена.' });
    }
    return res.status(200).send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUES_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка.' });
    } else {
      next(err);
    }
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена.' });
    }
    return res.status(STATUS_OK).send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUES_ERROR).send({ message: 'Переданы некорректные данные для снятии лайка.' });
    } else {
      next(err);
    }
  });

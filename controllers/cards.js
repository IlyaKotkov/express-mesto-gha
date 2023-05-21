const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequesError = require('../errors/BadRequesError');
const ForbiddenError = require('../errors/ForbiddenError');

const STATUS_OK = 200;

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequesError('Переданы некорректные данные при создании карточки.'));
      }
      next(err);
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
    .then((card) => {
      if (card.owner !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав для этого действия');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка по указанному _id не найдена.'));
      } else if (err.name === 'CastError') {
        next(new BadRequesError('Передан некорректный _id.'));
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
      next(new NotFoundError('Карточка с указанным _id не найдена.'));
    }
    return res.status(STATUS_OK).send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequesError('Переданы некорректные данные для постановки лайка.'));
    } else {
      next(err);
    }
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    const newError = new Error();
    newError.name = 'DocumentNotFoundError';
    throw newError;
  })
  .then((card) => { res.status(STATUS_OK).send({ data: card }); })
  .catch((err) => {
    if (err.status === 'DocumentNotFoundError') {
      next(new NotFoundError('Карточка с указанным _id не найдена.'));
    } else if (err.name === 'CastError') {
      next(new BadRequesError('Переданы некорректные данные для постановки лайка.'));
    } else {
      next(err);
    }
  });

const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

module.exports = router;

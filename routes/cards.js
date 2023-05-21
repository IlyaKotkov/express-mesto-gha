const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getCard, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');
const celebrates = require('../middlewares/celebrates');

router.get('/cards', auth, getCard);
router.delete('/cards/:cardId', celebrates.checkIdCard, auth, deleteCardById);
router.post('/cards', celebrates.createCard, auth, createCard);
router.put('/cards/:cardId/likes', celebrates.checkIdCard, auth, likeCard);
router.delete('/cards/:cardId/likes', celebrates.checkIdCard, auth, dislikeCard);

module.exports = router;

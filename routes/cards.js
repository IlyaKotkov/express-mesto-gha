const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getCard, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', auth, getCard);
router.delete('/cards/:cardId', auth, deleteCardById);
router.post('/cards', auth, createCard);
router.put('/cards/:cardId/likes', auth, likeCard);
router.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = router;

const router = require('express').Router();
const { getCard, createCard, deleteCardById, likeCard, dislikeCard  } = require('../controllers/users');

router.get('/cards', getCard );
router.delete('/cards/:cardId', deleteCardById  );
router.post('/cards', createCard );
router.put('/cards/:cardId/likes', likeCard)
router.delete('/cards/:cardId/likes', dislikeCard)

module.exports = router;
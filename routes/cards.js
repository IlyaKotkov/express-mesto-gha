const router = require('express').Router();
const { getCard, createCard, deleteCardById, likeCard, dislikeCard  } = require('../controllers/cards');

router.get('/cards', getCard );
router.delete('/cards/:cardId', deleteCardById  );
router.post('/cards', createCard );
router.put('/cards/:cardId/likes', likeCard)
router.delete('/cards/:cardId/likes', dislikeCard)
router.use('/*', (req, res) => {
  res.status(404).send({message: "Запрашиваемая страница не найдена"})
})

module.exports = router;
const router = require('express').Router();
const { getUsers, getUsersById, createUser,  updateUserInfo, updateUserAvatar  } = require('../controllers/users');

router.get('/users', getUsers );
router.get('/users/:userId', getUsersById  );
router.post('/users', createUser );
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateUserAvatar);
router.use('/*', (req, res) => {
  res.status(404).send({message: "Запрашиваемая страница не найдена"})
})

module.exports = router;
const router = require('express').Router();
const { getUsers, createUser, getUsersById, updateUserInfo, updateUserAvatar  } = require('../controllers/users');

router.get('/users', getUsers );
router.get('/users/:userId', getUsersById  );
router.post('/users', createUser );
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
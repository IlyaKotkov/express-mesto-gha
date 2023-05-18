const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers, getUsersById, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', auth, getUsers);
router.get('/users/me', auth, getUsersById);
router.get('/users/:userId', auth, getUsersById);
router.patch('/users/me', auth, updateUserInfo);
router.patch('/users/me/avatar', auth, updateUserAvatar);

module.exports = router;

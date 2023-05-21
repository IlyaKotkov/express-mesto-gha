const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers, getUsersById, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');
const celebrates = require('../middlewares/celebrates');

router.get('/users', auth, getUsers);
router.get('/users/me', auth, getUsersById);
router.get('/users/:userId', celebrates.getUsersId, auth, getUsersById);
router.patch('/users/me', celebrates.updateUser, auth, updateUserInfo);
router.patch('/users/me/avatar', celebrates.updateAvatar, auth, updateUserAvatar);

module.exports = router;

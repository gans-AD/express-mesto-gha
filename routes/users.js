const router = require('express').Router();
const {
  getUsers,
  userById,
  editUser,
  editAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/user/me', getCurrentUser);
router.get('/:userId', userById);
router.patch('/me', editUser);
router.patch('/me/avatar', editAvatar);

module.exports = router;

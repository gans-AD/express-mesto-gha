const router = require('express').Router();
const {
  getUsers,
  userById,
  editUser,
  editAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', userById);
router.patch('/me', editUser);
router.patch('/me/avatar', editAvatar);

module.exports = router;

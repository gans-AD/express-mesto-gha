const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  userById,
  editUser,
  editAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), userById);
router.patch('/me', editUser);
router.patch('/me/avatar', editAvatar);

module.exports = router;

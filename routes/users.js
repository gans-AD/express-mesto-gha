const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  userById,
  editUser,
  editAvatar,
  getCurrentUser,
} = require('../controllers/users');

const validationUser = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    link: Joi.string()
      .pattern(
        /^(https?:\/\/)?(w{3}\.)?([a-z0-9.-]+)\.([a-z.]{2,6})([a-zA-Z0-9-._~:/?#[]@!$&'()*\+,;=]*)*#?/,
      ),
  }),
});

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  userById,
);
router.patch('/me', validationUser, editUser);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      link: Joi.string()
        .pattern(
          /^(https?:\/\/)?(w{3}\.)?([a-z0-9.-]+)\.([a-z.]{2,6})([a-zA-Z0-9-._~:/?#[]@!$&'()*\+,;=]*)*#?/,
        )
        .required(),
    }),
  }),
  editAvatar,
);

module.exports = router;

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const validationId = () => celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const validationCard = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string()
      .pattern(
        /^(https?:\/\/)?(w{3}\.)?([a-z0-9.-]+)\.([a-z.]{2,6})([a-zA-Z0-9-._~:/?#[]@!$&'()*\+,;=]*)*#?/,
      )
      .required(),
  }),
});

router.get('/', validationCard, getCards);
router.post('/', validationCard, createCard);
router.delete('/:cardId', validationId, deleteCardById);
router.put('/:cardId/likes', validationId, likeCard);
router.delete('/:cardId/likes', validationId, dislikeCard);

module.exports = router;

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

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', validationId, deleteCardById);
router.put('/:cardId/likes', validationId, likeCard);
router.delete('/:cardId/likes', validationId, dislikeCard);

module.exports = router;

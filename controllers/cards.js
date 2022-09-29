const Card = require('../models/card');

const BadRequestError = require('../utils/errors/bad-req-err');
const NotFoundError = require('../utils/errors/not-found-err');
const ForbiddenError = require('../utils/errors/forbid-err');

// запрос всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// добавление карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body; // получаем из запроса объект с данными

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError(
          'Переданы некорректные данные при создании карточки',
        );
        next(error);
      }
      next(err);
    });
};

// удаление карточки по _id
module.exports.deleteCardById = (req, res, next) => {
    Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      } else if (card.owner._id !== req.user._id) {
        throw new ForbiddenError('Нельзя удалять чужую карточку');
      } else {
        card.remove().then(res.status(200).send({ message: 'карточка удалена' }));};
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError(
          'Переданы некорректные данные карточки',
        );
        next(error);
      }
      next(err);
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError(
          'Переданы некорректные данные для постановки/снятии лайка',
        );
        next(error);
      }

      next(err);
    });
};

// удалить лайк
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError(
          'Переданы некорректные данные для постановки/снятии лайка',
        );
        next(error);
      }
      next(err);
    });
};

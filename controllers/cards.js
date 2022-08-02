const Card = require('../models/card');

const { ERROR_CODE, NOT_FOUND_CODE, DEFAULT_ERROR_CODE } = require('../utils/errors');

// запрос всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

// добавление карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body; // получаем из запроса объект с данными

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

// удаление карточки по _id
module.exports.deleteCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      card.remove().then(res.send({ message: 'карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные карточки',
        });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Передан несуществующий _id карточки' });
        return;
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка',
        });
        return;
      }

      res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

// удалить лайк
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Передан несуществующий _id карточки' });
        return;
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка',
        });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

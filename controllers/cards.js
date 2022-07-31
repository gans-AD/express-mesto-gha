const Card = require('../models/card');

// запрос всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body; // получаем из запроса объект с данными

  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// удаление карточки по _id
module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => res.send({ message: 'карточка удалена' }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

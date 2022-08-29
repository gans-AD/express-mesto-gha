const User = require('../models/user');

const { ERROR_CODE, NOT_FOUND_CODE, DEFAULT_ERROR_CODE } = require('../utils/errors');

// запрос всех пользователя
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

// поиск пользователя по _id
module.exports.userById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные пользователя',
        });
        return;
      }

      res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

// создание пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body; // получаем из запроса объект с данными

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

// редактирование профиля
module.exports.editUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
        return;
      }

      res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

// редактирование аватара
module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
        return;
      }

      res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

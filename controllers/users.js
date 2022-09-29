const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const BadRequestError = require('../utils/errors/bad-req-err');
const NotFoundError = require('../utils/errors/not-found-err');
const DuplicateError = require('../utils/errors/duplicate-err');

// создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body; // получаем из запроса объект с данными

  // создаем хеш пароля
  // и записываем пользователя в базу, вместо пароля сохраняем его хеш

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        data: {
          id: user._id,
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      }

      if (err.code === 11000) {
        next(new DuplicateError('Пользователь с таким Email уже существует'));
      }

      next(err);
    });
};

// аутентификация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // успешная аутентификация
      // создаем токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });

      // отправляем токен в куки
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch(next);
};

// запрос всех пользователя
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// поиск пользователя по _id
module.exports.userById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError(
          'Переданы некорректные данные пользователя',
        );
        next(error);
      }
      next(err);
    });
};

// редактирование профиля
module.exports.editUser = (req, res, next) => {
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
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        const error = new BadRequestError(
          'Переданы некорректные данные при обновлении профиля',
        );
        next(error);
      }

      next(err);
    });
};

// редактирование аватара
module.exports.editAvatar = (req, res, next) => {
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
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        const error = new BadRequestError(
          'Переданы некорректные данные при обновлении аватара',
        );
        next(error);
      }

      next(err);
    });
};

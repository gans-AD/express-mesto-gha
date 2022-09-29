const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const NotFoundError = require('./utils/errors/not-found-err');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

// подключаем базу данных mestodb
mongoose.connect('mongodb://localhost:27017/mestodb');

// роуты, доступные без авторизации
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(
        /^(https?:\/\/)?(w{3}\.)?([a-z0-9.-]+)\.([a-z.]{2,6})([a-zA-Z0-9-._~:/?#[]@!$&'()*\+,;=]*)*#?/,
      ),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

// мидлвэр авторизации
app.use(auth);

app.use('/users', require('./routes/users'));
app.use(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      link: oi
        .string()
        .pattern(
          /^(https?:\/\/)?(w{3}\.)?([a-z0-9.-]+)\.([a-z.]{2,6})([a-zA-Z0-9-._~:/?#[]@!$&'()*\+,;=]*)*#?/,
        ),
    }),
  }),
  require('./routes/cards'),
);

app.use('*', () => {
  throw new NotFoundError('несуществующий маршрут');
});

// мидлвэр обработки ошибок Celebrate
app.use(errors());

// централизованная обработка ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`приложение запущено на порте ${PORT}`);
});

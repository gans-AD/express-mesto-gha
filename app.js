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
app.post('/signin', login);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keyes({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

// мидлвэр обработки ошибок Celebrate
app.use(errors());

// мидлвэр авторизации
app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', () => {
  throw new NotFoundError('несуществующий маршрут');
});

// централизованная обработка ошибок
app.use((err, req, res) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT, () => {
  console.log(`приложение запущено на порте ${PORT}`);
});

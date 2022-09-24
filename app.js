const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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
app.post('/signup', createUser);

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

  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
});

app.listen(PORT, () => {
  console.log(`приложение запущено на порте ${PORT}`);
});

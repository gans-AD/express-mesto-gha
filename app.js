const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

// подключаем базу данных mestodb
mongoose.connect('mongodb://localhost:27017/mestodb');

// временная подстановка id пользователя
app.use((req, res, next) => {
  req.user = {
    _id: '62e361c8a3f7a3e01b19370e',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`приложение запущено на порте ${PORT}`);
});

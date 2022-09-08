const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AuthentificationError = require('../utils/errors/auth-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
});

// проверяем наличие пользователя с указанными почтой и паролем
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).then((user) => {
    if (!user) {
      throw new AuthentificationError('Неправильные почта или пароль');
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new AuthentificationError('Неправильные почта или пароль');
      }
      return user;
    });
  });
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);

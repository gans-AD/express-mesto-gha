const jwt = require('jsonwebtoken');
const AuthentificationError = require('../utils/errors/auth-err');

module.exports = (req, res, next) => {
  // достаем авторизационный заголовок
  const { authorization } = req.headers;
  console.log(authorization);

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startWith('Bearer ')) {
    throw new AuthentificationError('Необходима авторизация');
  }

  // извлекаем токен
  const token = authorization.replace('Bearer', '');
  let payload;
  // верифицируем токен
  // проверяем что пользователь прислал именно тот токен, который был выдан ему ранее
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch {
    next(new AuthentificationError('Необходима авторизация'));

    req.user = payload;
    next();
  }
};

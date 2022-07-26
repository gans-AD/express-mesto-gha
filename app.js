const express = require('express');

const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log(`приложение запущено на порте ${PORT}`)
})
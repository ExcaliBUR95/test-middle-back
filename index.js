const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/user', require('./routes'));
app.use('/upload', express.static(path.resolve(__dirname, 'upload')));

const { MONGO_URL, PORT } = process.env;

const start = async () => {
  try {
    mongoose
    .connect(MONGO_URL)
    .then(() => console.log('Успешное соединение...'))
    .catch(() => console.log('Пал хила'));
    app.listen(PORT || 7000, () => {
      console.log('server started on port' + PORT);
    });
  } catch (e) {
    console.log(e);
  }
};

start();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require("./routes/user"));
app.use("/upload", express.static(path.resolve(__dirname, "upload")));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Успешное соединение...'))
  .catch(() => console.log('Пал хила'));

app.listen(process.env.PORT, () => {
  console.log('Сервер запущен на http://localhost:8000/');
});
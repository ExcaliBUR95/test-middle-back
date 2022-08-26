const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const { MONGO_URL, PORT } = process.env;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/user", require("./routes/user"));
app.use("/upload", express.static(path.resolve(__dirname, "upload")));

const start = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    app.listen(PORT || 7000, () => {
      console.log("server started on port" + PORT);
    });
  } catch (e) {
    console.log(e);
  }
};

start();

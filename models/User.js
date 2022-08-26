const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  male: Boolean,
  nickName: String,
  brithDay: String,
  img: {
    type: String,
  },
});

module.exports = mongoose.model("User", schema);

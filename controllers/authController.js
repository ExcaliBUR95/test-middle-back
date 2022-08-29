const UserModel = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');

async function login(req, res) {
  const { email, password } = req.body;
  try {
    let user = await UserModel.findOne({ email });

    !user ? res.sendStatus(422 + '14') : null;

    const comparePassword = bcryptjs.compareSync(password, user.password);

    !comparePassword ? res.sendStatus(422 + '20') : null;

    const { _id } = user;

    const response = {
      _id,
      email,
      token: jwt.sign(
        {
          _id,
          email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '24h',
        }
      ),
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Не правильно введен пароль!' });
  }
}

async function register(req, res) {
  const { email, password } = req.body;

  try {
    let user = await UserModel.findOne({ email });

    user ? res.status(422).json({ error: 'Такой email уже существует' }) : null;

    await UserModel.create({
      email,
      password: bcryptjs.hashSync(password, 10),
      male: req.body.male,
      nickName: req.body.nickName,
      brithDay: req.body.brithDay,
      img: req.body.img,
    });

    return res.sendStatus(201);
  } catch (e) {
    return res.status(500).json({ error: 'Не правильно введены данные!' });
  }
}

async function getUsers(req, res) {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (e) {
    res.status(400).json(e.toString());
  }
}

async function addImage(req, res) {
  try {
    await UserModel.findByIdAndUpdate(req.params.id, {
      img: req.file.path,
    });
    const getImg = await UserModel.findById(req.params.id);
    res.json(getImg);
  } catch (e) {
    res.status(500).json(`ошибка c ${e.toString()}`);
  }
}

async function changePassword(req, res) {
  try {
    const { password_old, password_new } = req.body;

    let user = await UserModel.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    const comparePassword = bcryptjs.compareSync(password_old, user.password);

    !comparePassword
      ? res.status(422).json({
          error: 'Ошибка, старый пароль введен неверно!',
        })
      : null;

    await UserModel.findByIdAndUpdate(req.params.id, {
      password: bcryptjs.hashSync(password_new, 10),
      nickName: req.body.nickName,
    });
    res.status(200).json('Успешно');
  } catch (e) {
    res.status(400).json({ error: e.toString() });
  }
}
async function getUserById(req, res) {
  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $project: {
          img: "$img",
          nickName: "$nickName",
          brithDay: "$brithDay",
          email: "$email",
        },
      },
    ]);

    res.json(user);
  } catch (e) {
    res.status(400).json(e.toString());
  }
}
module.exports = {
  login,
  register,
  getUsers,
  addImage,
  getUserById,
  changePassword,
};

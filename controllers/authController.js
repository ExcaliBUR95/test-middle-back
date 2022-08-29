const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

async function login(req, res) {
  const {
    body: { email, password },
  } = req;

  try {
    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.sendStatus(422 + "14");
    }

    const comparePassword = bcrypt.compareSync(password, user.password);

    if (!comparePassword) {
      return res.sendStatus(422 + "20");
    }

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
          expiresIn: "24h",
        }
      ),
    };

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ error: "Не правильно введен пароль!" });
  }
}

async function register(req, res) {
  const {
    body: { email, password },
  } = req;

  try {
    let user = await UserModel.findOne({ email });

    if (user) {
      return res.status(422).json({ error: "Такой email уже существует" });
    }

    await UserModel.create({
      email,
      password: bcrypt.hashSync(password, 10),
      male: req.body.male,
      nickName: req.body.nickName,
      brithDay: req.body.brithDay,
      img: req.body.img,
    });

    return res.sendStatus(201);
  } catch (e) {
    return res.status(500).json({ error: "Не правильно введены данные!" });
  }
}
async function getUsers(req, res) {
  try {
    const user = await UserModel.find();
    res.json(user);
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
    res
      .status(500)
      .json(`ошибка в юезр контроллерс адд имейдж ${e.toString()}`);
  }
}
async function changePassword(req, res) {
  try {
    const {
      body: { password_old, password_new },
    } = req;
    let user = await UserModel.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    const comparePassword = bcrypt.compareSync(password_old, user.password);

    if (!comparePassword) {
      return res
        .status(422)
        .json({ error: "Ошибка, старый пароль введен неверно!" });
    }
    await UserModel.findByIdAndUpdate(req.params.id, {
      password: bcrypt.hashSync(password_new, 10),
      nickName: req.body.nickName
    });
    console.log(password_new);
    res.status(200).json('uspeh');
  } catch (e) {
    res.status(400).json({ error: e.toString() });
  }
}
async function getUserById(req, res) {
  try {
    const user = await UserModel.findById( {_id: req.params.id});
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
// async function changePassword(req,res) {
//   try {
//     const {
//       body: {  password_new },
//     } = req;
//     let user = await UserModel.aggregate()
//     .match({_id:  mongoose.Types.ObjectId(req.params.id)})

//     const comparePassword = bcrypt.compareSync(password,  password_old);

//     if(!comparePassword){
//       return res.status(422 + "20").json({error: 'Ошибка, старый пароль введен неверно!'})
//     }

//     await UserModel.findByIdAndUpdate(req.params.id, {
//       password_old: req.body.req,
//       password_new: bcrypt.hashSync(password_new, 10),
//     })
//     res.status(200).json(pas,"Пароль успешно изменен")
//   } catch (e) {
//     res.status(500).json({error: e.toString()})
//   }
// }

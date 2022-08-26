const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function checkAuth(req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  const {
    headers: { token },
  } = req;
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("authorization request");
    }

    const [typeOfToken, tokenString] = token.split(" ");
    if (typeOfToken !== "Bearer") {
      throw new Error("Поддерживается только тип токена Bearer");
    }

    const decodes = jwt.verify(tokenString, process.env.JWT_SECRET);
    req.user = await User.findById(decodes._id);
    console.log( req.user);
    return next();
  } catch (e) {
    return res.send(e.toString());
  }
}

module.exports = { checkAuth };

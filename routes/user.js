const { Router } = require('express');
const { login, register, getUsers, addImage, getUserById, changePassword } = require('../controllers/authController');
const fileMiddleware = require('../middleware/file.middleware');
const { checkAuth } = require('../middleware/checkUs');
const router = Router();

router.post('/login', login);
router.post('/registration', register);
router.get('/users', getUsers);
router.patch('/img/:id', checkAuth, fileMiddleware.single('avatar'), addImage);
router.get('/user/:id', checkAuth, getUserById);
router.patch('/pass/:id', checkAuth, changePassword);
module.exports = router;

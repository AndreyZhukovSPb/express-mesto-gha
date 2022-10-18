const router = require('express').Router();
// const mongoose = require('mongoose');
// const User = require('../models/user');
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.post('/users', createUser);

router.get('/users/:userId', getUserById);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;

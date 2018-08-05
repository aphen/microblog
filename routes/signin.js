const express = require('express');
const router = express.Router();
const checkNotLogin = require('../middlewares/check').checkNotLogin;

//GET /signin 登录页
router.get('/', checkNotLogin, (req, res, next) => {
    res.send('登录页');
});

//GET /signin 登录页
router.post('/', checkNotLogin, (req, res, next) => {
    res.send('登录');
});

module.exports = router;
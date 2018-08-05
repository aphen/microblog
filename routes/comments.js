const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;

//Post /comments 创建一条留言
router.post('/', checkLogin, (req, res, next) =>{
   res.send('创建留言');
});

//Get /comments/:commentId/remove
router.get('/:commentId/remove', checkLogin, (req, res, next) => {
   res.send('删除留言');
});

module.exports = router;
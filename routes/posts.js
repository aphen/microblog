const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin;

//Get /posts 所有用户或特定用户的文章页
//eg: GET /posts/?author=xxx
router.get('/', (req, res, next) => {
    console.log('主页')
    res.send('主页');
});

//Post /posts/create 发表一篇文章
router.post('/create', checkLogin, (req, res, next)=>{
    res.send('发表文章');
});

//Get /posts/create 发表文章页
router.get('/create', checkLogin, (req, res, next) => {
    res.send('发表文章页');
});

//Get /posts/:postId 单独一篇的文章页
router.get('/:postId', checkLogin, (req, res, next) => {
    res.send('文章详情页');
});

//Get /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, (req, res, next) => {
    res.send('更新文章页');
});

//Post /posts/:postId/edit 更新文章
router.post('/:postId/edit', checkLogin, (req, res, next) => {
    res.send('更新文章');
});

//Get /posts/:postId/remove 删除文章
router.get('/:postId/remove', checkLogin, (req, res, next) => {
    res.send('删除文章');
});

module.exports = router;

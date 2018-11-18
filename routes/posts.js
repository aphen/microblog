const express = require('express');
const router = express.Router();
const postModel = require('../models/posts');
const checkLogin = require('../middlewares/check').checkLogin;

//Get /posts 所有用户或特定用户的文章页
//eg: GET /posts/?author=xxx
router.get('/', (req, res, next) => {

    //res.render('posts');
    const author = req.query.author;
    console.log(req.query)
    postModel.getPosts(author)
        .then((posts)=>{
            //console.log(posts);
            res.render('posts', {
                posts: posts
            });
        })
        .catch(next);
    //res.send('主页');
});

//Post /posts/create 发表一篇文章
router.post('/create', checkLogin, (req, res, next)=>{
   // res.send('发表文章');
   const author = req.session.user._id;
   const title = req.fields.title;
   const content = req.fields.content;

   //校验参数
    try{
        if(!title.length){
            throw new Error('请填写标题');
        }
        if(!content.length){
            throw new Error('请填写内容');
        }
    }catch (e) {
        req.flash('error', e.message);
        return res.redirect('back');
    }

    let post = {
        author: author,
        title: title,
        content: content
    };

    postModel.create(post)
        .then((result) => {
            console.log(result)
            // 此 post 是插入 mongodb 后的值，包含 _id
            post = result.ops[0];
            req.flash('success', '发表成功');
            //发表成功后跳动到该文章页
            res.redirect(`/post/${post._id}`);
        });
});

//Get /posts/create 发表文章页
router.get('/create', checkLogin, (req, res, next) => {
    //res.send('发表文章页');
    res.render('create');
});

//Get /posts/:postId 单独一篇的文章页
router.get('/:postId', checkLogin, (req, res, next) => {
    //res.send('文章详情页');
    const postId = req.params.postId;

    Promise.all([
        postModel.getPostById(postId), //获取文章信息
        postModel.incPv(postId) //pv加1
    ])
        .then(function(result){
            const post = result[0];
            if(!post){
                throw new Error('该文章不存在');
            }
            res.render('post', {
                post: post
            });
        })
        .catch(next);
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

const express = require('express');
const router = express.Router();
const postModel = require('../models/posts');
const CommentModel = require('../models/comments');
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
            res.redirect(`/posts/${post._id}`);
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
        CommentModel.getComments(postId), //获取该文章下的所有留言
        postModel.incPv(postId) //pv加1
    ])
        .then(function(result){
            const post = result[0];
            const comments = result[1];
            if(!post){
                throw new Error('该文章不存在');
            }
            res.render('post', {
                post: post,
                comments: comments
            });
        })
        .catch(next);
});

//Get /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, (req, res, next) => {
    //res.send('更新文章页');
    const postId = req.params.postId;
    const auther = req.session.user._id;

    postModel.getRawPostById(postId)
        .then((post)=>{
            if(!post){
                throw new Error('该文章不存在');
            }
            console.log(post);
            if(auther.toString()!==post.author._id.toString()){
                throw new Error('权限不足');
            }
            res.render('edit', {
                post: post
            });
        })
        .catch(next);
});

//Post /posts/:postId/edit 更新文章
router.post('/:postId/edit', checkLogin, (req, res, next) => {
    //res.send('更新文章');
    const postId = req.params.postId;
    const auther = req.session.user._id;
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
    }catch(e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    postModel.getRawPostById(postId)
        .then((post)=>{
            if(!post){
                throw new Error('文章不存在');
            }
            if(auther.toString()!==post.author._id.toString()){
                throw new Error('没有权限');
            }

            postModel.updatePostById(postId, {title: title, content:content})
                .then(()=>{
                    req.flash('success', '编辑文章成功');
                    //编辑成功后跳转到上一页
                    res.redirect(`/posts/${postId}`);
                }).catch(next);
        });
});

//Get /posts/:postId/remove 删除文章
router.get('/:postId/remove', checkLogin, (req, res, next) => {
    //res.send('删除文章');
    const postId = req.params.postId;
    const author = req.session.user._id;
    console.log(author, 'author');
    postModel.getRawPostById(postId)
        .then((post)=>{
            if(!post){
                throw new Error('文章不存在');
            }
            if(author.toString()!==post.author._id.toString()){
                throw new Error('没有权限');
            }

            postModel.delPostById(postId, author)
                .then(()=>{
                    req.flash('success', '删除文章成功');
                    //删除成功跳转到主页
                    res.redirect('/posts');
                })
                .catch(next);
        });
});

module.exports = router;

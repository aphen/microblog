const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;
const CommentModel = require('../models/comments');

//Post /comments 创建一条留言
router.post('/', checkLogin, (req, res, next) =>{
   //res.send('创建留言');
   const author = req.session.user._id;
   const postId = req.fields.postId;
   const content = req.fields.content;

   //检验参数
   try{
      if(!content.length){
         throw new Error('请填写留言');
      }
   }catch(e){
      req.flash('error', e.message);
      return res.redirect('back');
   }

   const comment = {
      author: author,
      postId: postId,
      content: content
   };

   CommentModel.create(comment)
      .then(()=>{
         req.flash('success', '留言成功');
         //留言成功后跳转到上一页
         res.redirect('back');
      })
      .catch(next)
});

//Get /comments/:commentId/remove 删除一条留言
router.get('/:commentId/remove', checkLogin, (req, res, next) => {
   //res.send('删除留言');
   const commentId = req.params.commentId;
   const author = req.session.user._id;

   CommentModel.getCommentById(commentId)
      .then((comment)=>{
         if(!comment){
            throw new Error('留言不存在');
         }

         if(comment.author.toString() !== author.toString()){
         
            throw new Error('没有权限删除留言');
         }

         CommentModel.delCommentById(commentId)
            .then(()=>{
               req.flash('success', '删除留言成功');
               //删除成功后跳转到上一页
               res.redirect('back');
            })
            .catch(next)
      })
});

module.exports = router;
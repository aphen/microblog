const marked = require('marked');
const Comment = require('../lib/mongo').Comment;

//将comment的content 从markdown转换成html
Comment.plugin('contentToHtml', {
    afterFind: function (comments) {
        return comments.map((comment)=>{
            comment.content = marked(comment.content);
            return comment;
        });
    }
});

module.exports = {
    //创建一个留言
    create: function(comment){
        return Comment.create(comment).exec();
    },
    //通过留言id获取一个留言
    getCommentById: (commentId) =>{
        return Comment.findOne({_id: commentId}).exec();
    },
    //通过留言id删除一个留言
    delCommentById: (commentId)=>{
        return Comment.deleteOne({_id: commentId}).exec();
    },
    //通过文章id删除该文章下的所有留言
    delCommentsByPostId: (postId)=>{
        return Comments.deleteMany({postId: postId}).exec();
    },
    //通过文章id获取该文章下的所有留言，按留言创建时间升序
    getComments: (postId)=>{
        return Comment
            .find({postId: postId})
            .populate({path: 'author', model: 'User'})
            .sort({_id: 1})
            .addCreatedAt()
            .contentToHtml()
            .exec();
    }
};
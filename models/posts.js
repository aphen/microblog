const marked = require('marked');
const Post = require('../lib/mongo').Post;

// 将 post 的 content 从 markdown 转换成 html
Post.plugin('contentToHtml', {
    afterFind: (posts)=>{
         return posts.map((post)=> {
             post.content = marked(post.content);
             return posts;
         });
    },
    afterFindOne: (post) =>{
        if(post) {
            post.content = marked(post.content);
            return post;
        }
    }
})

module.exports = {
    //创建一篇文章
    create: function create(post){
        return Post.create(post).exec();
    },
    //通过文章Id获取一篇文章
    getPostById: (postId)=>{
        return Post
            .findOne({_id: postId})
            .populate({path: 'author', model: 'User'})
            .addCreateAt()
            .contentToHtml()
            .exec();
    },
    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getPosts: (author)=>{
        const query = {};
        if(author){
            query.author = author;
        }
        return Post
            .find(query)
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .addCreateAt()
            .contentToHtml()
            .exec();
    },
    //通过文章id给pv加1
    incPv: (postId)=>{
        return Post
            .update({_id: postId}, {$inc: {pv: 1}})
            .exec();
    }
}

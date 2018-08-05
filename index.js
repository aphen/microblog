/**
 * Created by web on 23/7/18.
 */
const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);
const routes = require('./routes');
const pkg = require('./package');

const app = express();

//设置模板目录
app.set('views', path.join(__dirname, 'views'));
//加上这名后模板以html结尾
app.engine('html', require('ejs').__express); //或app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html');

//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
//session中件件
app.use(session({
    name: config.session.key, //设置cookie中保存session id的字段
    secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true, //强制更新session
    saveUninitialized: false, //设置为false, 强制创建一个session,即使用户未登录
    cookie: {
        maxAge: config.session.maxAge //过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new MongoStore({ //将session存储到mongodb
        url: config.mongodb //mongodb地址
    })
}));

//flash中件夹，用来显示通知
app.use(flash());

//路由
routes(app);

app.listen(config.port, () => {
    console.log(`${pkg.name} listening on port ${config.port}`);
});
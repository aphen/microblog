module.exports = {
    port: 3001,
    session: {
        secret: 'myblog',
        key: 'myblog',
        maxAge: 2592000000
    },
    //mongodb: 'ngodb://<dbuser>:<dbpassword>@ds064718.mlab.com:64718/myblog'
    mongodb: 'mongodb://localhost:27017/myblog'
};
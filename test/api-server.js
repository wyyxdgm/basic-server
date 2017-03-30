/**
 * 后端api模拟
 */

var config = require('../config');
process.on('uncaughtException', function(err) {
    console.log('-----------------------')
    console.log(err.stack);
    console.log('-----------------------')
});
var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var path = require('path');
var app = new express();
app.set('port', 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(require("cookie-parser")());
var users = {
    "test@qq.com": {
        _id: 'hflkahskdhfkjasdffxe3414',
        name: 'test',
        email: 'test@qq.com',
        password: 'test'
    },
    "name1@qq.com": {
        _id: 'hflkahsffffffsdfkdhfk321',
        name: 'name1',
        email: 'name1@qq.com',
        password: 'password1'
    },
    "name2@qq.com": {
        _id: 'hxxxxahsxxxxkdhfkjasdc35',
        name: 'name2',
        email: 'name2@qq.com',
        password: 'password2'
    }
};
var sessions = {}
app.use(function(req, res, next) {
    console.log(req.cookies.id, sessions[req.cookies.id])
    req.user = req.cookies.id && sessions[req.cookies.id] || null; //session取出用户。取不到为null
    next();
});
/*模拟登录*/
app.post('/account/login', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    if (!email || !password) return res.send({
        success: false,
        msg: '用户名或密码不存在'
    });
    var user = users[email];
    if (!user) return res.send({
        success: false,
        msg: '用户不存在'
    });
    if (password != user.password) return res.send({
        success: false,
        msg: '密码错误'
    });
    sessions[user._id] = user;
    res.cookie('id', user._id, {
        maxAge: 600000,
        httpOnly: true,
        path: '/'
    });
    return res.send({
        success: true,
        msg: '登录成功'
    });
});
/*模拟登出*/
app.post('/account/logout', loginfilter, function(req, res, next) {
    delete sessions[req.user.id];
    res.clearCookie('id');
    res.clearCookie('login');
    res.send({
        success: true
    });
});
/*模拟用户信息接口*/
app.post('/getUserInfo', loginfilter, function(req, res, next) {
    res.send({
        success: true,
        data: req.user
    });
});
/*模拟消息接口*/
app.post('/msg/get', loginfilter, function(req, res, next) {
    res.send({
        success: true,
        data: [{
            "_id": "58d8e01b8c64c4337279cff4",
            "delflag": 1,
            "email": "xxx@qq.com",
            "isread": "2",
            "msg": "您好！1",
            "time": "2017-03-27T09:49:15.756Z",
            "userid": "58d8ba096e7bf208321adaeb"
        }, {
            "_id": "58d8f4954242404dfa14590f",
            "delflag": 1,
            "email": "xxx@qq.com",
            "isread": "2",
            "msg": "您好！2",
            "time": "2017-03-27T11:16:37.467Z",
            "userid": "58d8ba096e7bf208321adaeb"
        }],
    })
});

function loginfilter(req, res, next) {
    if (!req.user) return res.send({
        success: false,
        code: '001',
        msg: '未登录'
    });
    next();
}

require('http').createServer(app).listen(app.get('port'), function(err) {
    console.log('Express server listening on port: ' + app.get('port'));
});

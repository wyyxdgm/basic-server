var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = new express();
var config = require('./conifg');
// req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// view engine
app.set('views', path.join(__dirname, 'static/html'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
// set port
app.set('port', config.port);
app.use(express.static('static'));

// uses
app.use('/', function(req, res) {
    res.render('index', {
        desc: 'hellow world from backend!!!'
    });
});

app.use(function(req, res, next) {
    console.log(req.path, req.method, req.params, req.body, req.query);
    next();
});

app.get('/', function(req, res, next) {
    res.end('hello index');
});
app.use(require('./routers/api'));

module.exports = app;
// 404 500
// todo 
/*404 && 500 resolve*/
// app.get('/404', function(req, res, next) {
//     res.end('/404/index.html');
// });

// app.get('/500', function(req, res, next) {
//     res.status(500).send('<div style="text-align:center;margin-top:200px;"><h3>服务器内部错误,<a href="/">返回主页</a></h3></div>');
// });

// app.use(function(err, req, res, next) {
//     console.log(err);
//     res.redirect('/500');
// });

// app.use(function(req, res, next) {
//     res.status(404).redirect('/404/index.html');
// });

module.exports = app;
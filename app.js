var express = require('express');
var path = require("path");
var ejs = require("ejs");
var app = new express();

// view engine
app.set('views', path.join(__dirname, 'static'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.set('port', 3001);

app.use(function(req, res, next) {
    console.log(req.path, req.method, req.params, req.body, req.query);
    //res.end('123456');
    next();
});
app.use('/login', require('./routers/login'));

module.exports = app;

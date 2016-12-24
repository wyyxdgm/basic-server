var express = require('express');
var bodyParser = require('body-parser');
var app = new express();
app.use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: false
    })).set('port', require('./config').port)
    .use(function(req, res, next) {
        console.log(req.path, req.method, req.params, req.body, req.query);
        next();
    })
    .get('/test', function(req, res, next) {
        res.end('test');
    })
    .use(require('./routers/api'));

module.exports = app;
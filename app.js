var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var app = new express();
var config = require('./config');
// req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// view engine

app.engine('.html', ejs.__express);
app.set("view engine", 'html');
app.set('views', __dirname + '/static/html');
app.use('/static', express.static('static'));
app.use('/bc', express.static('bower_components'));
app.use(express.static('static'))

app.use(express.static('static'));



app.get('/mvc1', function(req, res) {
    res.render('mvc1');
});
app.get('/mvc2', function(req, res) {
    res.render('mvc2');
});
app.get('/flex', function(req, res) {
    res.render('flex');
});
app.get('/attachEvent', function(req, res) {
    res.render('attachEvent');
});
app.get('/ngRoute', function(req, res) {
    res.render('ngRoute');
});
app.listen(8081, function() {
    console.log(__dirname);
    console.log('Express server listening on port: 8081');
});

var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var path = require('path');
var app = new express();
var appFilter = require('./controller/appfilter');
// req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
var config = require('./config');
// view engine
app.set('views', path.join(__dirname, 'static/html'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
// set port
app.set('port', config.port);

/*打印ip信息。appFilter---3种方式use。之一*/
app.use(appFilter.ipinfo());
/*重写render，渲染常用数据。appFilter---3种方式use。之二*/
app.use(appFilter.render);

// uses
app.use('/', function(req, res) {
	res.render('index', {
		desc: 'hellow world from backend!!!'
	});
});

app.get('/', function(req, res, next) {
	res.end('1');
	next();
});

/*处理404 && 500等。appFilter---3种方式use。之三*/
appFilter.routeCommonUgly(app);

module.exports = app;
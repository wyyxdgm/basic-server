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

app.use("/static", express.static('static'));
app.use("/bc", express.static('bower_components'));

/*打印ip信息。appFilter---3种方式use。之一*/
app.use(appFilter.ipinfo());
/*重写render，渲染常用数据。appFilter---3种方式use。之二*/
app.use(appFilter.render);

// uses 
/*use / */
app.use(require('./routers/index'));
/*use /account */
app.get('/account', require('./routers/account'));

/*处理404 && 500等。appFilter---3种方式use。之三*/
appFilter.routeCommonUgly(app);

module.exports = app;
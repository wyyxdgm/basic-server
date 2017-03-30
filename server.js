process.on('uncaughtException', function(err) {
	console.log('-----------------------')
	console.log(err.stack);
	console.log('-----------------------')
});

var app = require('./app');
require('http').createServer(app).listen(app.get('port'), function(err) {
	console.log('Express server listening on port: ' + app.get('port'));
});
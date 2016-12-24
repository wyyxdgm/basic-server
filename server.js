process.on('uncaughtException', function(err) {
    console.log('-----------------------')
    console.log(err.stack);
    console.log('-----------------------')
});

var fs = require('fs');
var path = require('path');
var app = require('./app');

if (!fs.existsSync('config.js')) {
    console.log('no config.js');
    process.exit(0);
}

require('http').createServer(app).listen(app.get('port'), function(err) {
    console.log('Express server listening on port: ' + app.get('port'));
});
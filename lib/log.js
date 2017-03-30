var winston = require('winston');
var config = require('../config');
var libObject = require('../lib/object');

exports.config = function(key) {
    var _config = {};
    if (!key || !config[key]) {
        _config[key] = {
            exitOnError: false,
            console: {
                colorize: true,
                level: 'debug',
                handleExceptions: true,
                humanReadableUnhandledException: true,
                timestamp: function() {
                    return libDate.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S');
                }
            },
            dailyRotateFile: {
                filename: '/var/log/winston',
                datePattern: '.yyyy-MM-dd.log',
                level: 'debug',
                json: false,
                handleExceptions: true,
                humanReadableUnhandledException: true,
                timestamp: function() {
                    return libDate.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S');
                }
            }
        }
    } else {
        _config = config;
    }
    exports.thirdlogger = new winston.Logger({
        exitOnError: _config[key].exitOnError,
        transports: [
            new(winston.transports.Console)(_config[key].console),
            new(require('winston-daily-rotate-file'))(_config[key].dailyRotateFile)
        ]
    });
}
exports.config(config.winston_key);
["debug", "info", "error", "warn"].forEach(function(level) {
    exports[level] = function(msg) {
        for (var key in arguments) {
            var p = arguments[key];
            if (typeof p == 'function') {
                arguments[key] = {}.toString.call(p);
            }
            if (typeof p == 'string' || typeof p == 'boolean' || !p) continue;
            if (libObject.isJson(p) || p.length) {
                arguments[key] = JSON.stringify(p);
            }
        }
        exports.thirdlogger[level].apply(exports.thirdlogger, arguments);
    };
});
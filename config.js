var libDate = require('./lib/date');
var config = {
    port: 3000,
    backendDomain: { /*后端接口地址*/
        api: 'http://127.0.0.1:8080/'
    },
    logdir: '/var/web/basic-server/log/',
    winston_key: 'winston',
    winston: {
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
            filename: '/var/web/basic-server/log/winston',
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
}
module.exports = config;

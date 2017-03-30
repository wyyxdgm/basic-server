var _ = require('underscore');
var libWebreq = require('./webreq');
var Logger = require('../lib/log');
var config = require('../config');

module.exports.post = function(urlStr, json, fn) {
    libWebreq.postForm(urlStr, json, function(err, result) {
        if (err) {
            Logger.debug(err);
            return fn(err);
        } else {
            try {
                result = JSON.parse(result.data);
            } catch (e) {
                Logger.debug('not a json', result);
            }
            return fn(null, result);
        }
    });
}

module.exports.postApi = postApi;

function postApi(urlStr, json, req, res, fn) {
    var headers = {};
    if (req.headers) {
        /*将客户端的cookie透明的传递到后端。*/
        headers = _.pick(req.headers, 'cookie');

        /*网站调用后端API的时候加上约定头部信息，便于接口区分调用方*/
        // headers['X-App-Type'] = 'basic-server';
        // headers['X-App-Version'] = '0.0.1';
        // headers['X-App-Env'] = config.env || 'prod';
        // headers['X-App-Key'] = 'basic-server';
    }
    Logger.info("start post------" + urlStr + '----------', json, headers);
    libWebreq.postForm2(urlStr, json, headers, function(err, result, headers) {
        Logger.info('\nfinish post>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n', urlStr, '\n------------------res body------------------------\n', result, '\n------------------res headers------------------------\n', headers, '\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n');
        if (err) {
            Logger.info(err);
            return fn(err);
        } else {
            var cookie_header = _.pick(headers, 'set-cookie');
            if (_.size(cookie_header)) Logger.info('returned headers-----------', cookie_header);
            if (_.size(cookie_header) && res && res.setHeader) res.setHeader('set-cookie', cookie_header['set-cookie']);
            return fn(null, result && result.data, headers);
        }
    });
}
/*实现通过api里边的key作为方法名直接请求对应的url*/
module.exports.do = {};
var api = require("../controller/api");
Object.keys(api).forEach(function(key) {
    module.exports.do[key] = function(jsondata, req, res, callback) {
        postApi(api[key], jsondata, req, res, callback);
    };
});

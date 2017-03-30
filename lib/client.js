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

module.exports.post2 = post2;

function post2(urlStr, json, req, res, fn) {
    var headers = {};
    if (req.headers) { /*官网调用网上直销API的时候加上这些参数，便于接口区分调用方*/
        headers = _.pick(req.headers, 'cookie');
        headers['X-App-Type'] = 'gw';
        headers['X-App-Version'] = '2.3.1';
        headers['X-App-Env'] = (config.env == 'uat' ? 'huidu' : 'release');
        headers['X-App-Key'] = 'gw';
    }
    Logger.debug("start post------" + urlStr + '----------', json, headers);
    libWebreq.postForm2(urlStr, json, headers, function(err, result, headers) {
        Logger.debug('\nfinish post>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n', urlStr, '\n------------------res body------------------------\n', result, '\n------------------res headers------------------------\n', headers, '\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n');
        if (err) {
            Logger.debug(err);
            return fn(err);
        } else {
            var cookie_header = _.pick(headers, 'set-cookie');
            if (Object.keys(cookie_header).length) Logger.debug('returned headers-----------', cookie_header);
            if (Object.keys(cookie_header).length && res && res.setHeader) res.setHeader('set-cookie', cookie_header['set-cookie']);
            if (result.data && result.data.success == false && result.data.code == "NT-0001") {
                if (req.session) {
                    req.session.user = null;
                    if (req.method == 'POST') return res.send({
                        success: false,
                        code: 'NT-0001'
                    });
                    return fn(null, result);
                    // return res.redirect('/?alertlogin=1');
                } else {
                    return fn(null, result);
                }
            } else {
                /*var cookie_header = _.pick(headers, 'set-cookie');
                for (var key in headers) {
                    if (res && res.setHeader) res.setHeader(key, headers[key]);
                }*/
                return fn(null, result);
            }
        }
    });
}

module.exports.do = {};
var api = require("../controller/api");
Object.keys(api).forEach(function(key) {
    module.exports.do[key] = function(jsondata, req, res, callback) {
        post2(api[key], jsondata, req, res, callback);
    };
});
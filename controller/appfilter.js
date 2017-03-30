var config = require('../config');
var Logger = require('../lib/log');
var pageController = require('../controller/page');
var libDate = require('../lib/date');
var client = require("../lib/client");

/*override render to append pages*/
function render(req, res, next) {
    var _origin_render = res.render;
    res.render = function(view, options, fn) {
        if (!options) options = {};
        if (!options.user) res.locals.user = req.user || {}; /*每个渲染的页面都赋值一个user(取自req.user)。或{}*/
        if (!options.config) res.locals.config = config; /*页面可以通过config.xxx取到config.js中的内容*/
        if (!options.page) { /*page.js中的内容渲染到指定页面*/
            pageController.genTmpl(res.locals, view);
        }
        res.locals.$routerParams = req.params; /*前端传过来的params参数在渲染的时候渲染回去。有时候能用到。前端用法：$routerParams.xxx*/
        res.locals.$queryParams = req.query; /*前端传过来的query参数在渲染的时候渲染回去。有时候能用到。前端用法：$queryParams.xxx*/
        res.locals.$postParams = req.body; /*前端传过来的body参数在渲染的时候渲染回去。有时候能用到。前端用法：$postParams.xxx*/
        _origin_render.apply(res, arguments);
        Logger.info('[path, view]-->' + JSON.stringify([req.path, view]));
    }
    var _origin_send = res.send;
    res.send = function() {
        _origin_send.apply(res, arguments);
        if (typeof arguments[0] !== 'string') Logger.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n', req.method, ' ', req.path, ' ==>\tquery : ', req.query, ', params : ', req.params, ', body : ', req.body, ' \nreturn:', arguments[0], '\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    }
    next();
}

/*common filter for req*/
function filter() {
    return function(req, res, next) {
        req._ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || "";
        Logger.info('[hostname, path, ip]-->', JSON.stringify([req.hostname, req.path, req._ip]));
        /*非页面请求直接next*/
        if (req.path.match(/(\.css|\.js|\.png|\.jpg|\.html|\.htc|\.htm|\.gif|\.map)$/)) return next();
        /*每个页面请求都把用户信息请求下来*/
        client.do.getUserInfo({}, req, res, function(err, result) {
            if (err) return next();
            if (result.data && result.data._id) {
                req.user = result.data;
                return next();
            } else
                return next();
        });
    }
}

/*404 && 500 resolve*/
function routeCommonUgly(app) {
    app.get(/\.css|\.js|\.png|\.jpg|\.gif|\.map$/, function(req, res, next) {
        res.status(404).end();
    });
    app.get('/404', function(req, res, next) {
        res.status(404).send('<a style="width:600px;border-radius:10px;margin:auto;background:#ddd;color:#aaa;text-align:center;margin-top:300px;display:block;text-decoration:none;font-family:"Times New Roman",Georgia,Serif;" href="/"><div style="font-size:30px;">您访问的页面不存在！ ^#^</div><div style="font-size:50px;font-weight:bold;">404</div></a>');
    });
    app.use(function(req, res, next) {
        res.redirect('/404');
    });
    app.get('/500', function(req, res, next) {
        res.status(500);
        res.send('<div style="margin-top:300px;text-align:center;font-size:20px;">服务器内部错误500，<a href="/">返回首页</a></div>');
    });
    app.use(function(err, req, res, next) {
        Logger.error(err);
        res.redirect('/500');
    });
}
module.exports.render = render;
module.exports.filter = filter;
module.exports.routeCommonUgly = routeCommonUgly;

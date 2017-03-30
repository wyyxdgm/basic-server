var router = require("express").Router();
var async = require('async');
var _ = require('underscore');
var libDate = require("../lib/date");
var Logger = require('../lib/log');
var libString = require('../lib/string');
var libUtils = require("../lib/utils");
var config = require("../config");
/* common business*/

function signin(req, res) {
    return res.render('account/signin');
}

function dosignin(req, res) {
    var client = require("../lib/client");
    client.do.login(req.body, req, res, function(err, result) {
        if (err) return sendErr(res, err);
        var goto = req.flash('goto'); //这个工具可以用来设置或取出临时变量。
        if (goto.length > 0) goto = goto[0];
        else goto = '';
        return res.send({
            data: result
            success: true,
            goto: goto
        });
    });
}

function signout(req, res, next) {
    res.clearCookie('remember_me');
    req.logout();
    res.redirect('/');
}

function info(req, res) {
    async.auto({
        sysmsglist: function(cb) {
            cb(null, [{
                "_id": "58d8e01b8c64c4337279cff4",
                "delflag": 1,
                "email": "xxx@qq.com",
                "isread": "2",
                "msg": "您好！1",
                "time": "2017-03-27T09:49:15.756Z",
                "userid": "58d8ba096e7bf208321adaeb"
            }, {
                "_id": "58d8f4954242404dfa14590f",
                "delflag": 1,
                "email": "xxx@qq.com",
                "isread": "2",
                "msg": "您好！2",
                "time": "2017-03-27T11:16:37.467Z",
                "userid": "58d8ba096e7bf208321adaeb"
            }]);
        }
    }, function(err, pageData) {
        if (err) return res.redirect('/500');
        var pagination = libUtils.pagingList(pageData.data, req.query.pageIndex, 5);
        return res.render('account/info', {
            libDate: libDate,
            sysmsgSchema: {},
            sysmsglist: pagination.data,
            pagination: pagination
        });
    });
}

function sysmsgPage(req, res) {
    // libDb.getModel("sysmsg").bcolect({
    //     userid: req.user._id,
    //     delflag: 1
    // }, {
    //     $sort: {
    //         time: -1
    //     }
    // }, function(err, pageData) {
    //     if (err) return res.redirect('/500');
    //     var pagination = libUtils.pagingList(pageData.data, req.query.pageIndex, 5);
    //     return res.render('page/sysmsg', {
    //         user: req.user,
    //         libDate: libDate,
    //         sysmsgSchema: schemaController.require('sysmsg'),
    //         sysmsglist: pagination.data,
    //         pagination: pagination
    //     });
    // });
}


router.route('/signin').get(signin);
router.route('/dosignin').post(dosignin);
router.route('/signout').get(signout);
router.route('/info').get(info);
router.route('/sysmsgpage').get(sysmsgPage);

module.exports = router;
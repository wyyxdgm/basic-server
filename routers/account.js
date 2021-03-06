var router = require("express").Router();
var async = require('async');
var _ = require('underscore');
var libDate = require("../lib/date");
var Logger = require('../lib/log');
var libString = require('../lib/string');
var libUtils = require("../lib/utils");
var config = require("../config");
var client = require("../lib/client");
/* common business*/

function signin(req, res) {
    return res.render('account/signin');
}

function dosignin(req, res) {
    client.do.login(req.body, req, res, function(err, result) {
        if (err) return res.send({
            error: err
        });
        return res.send({
            data: result,
            success: true,
            goto: '/'
        });
    });
}

function signout(req, res, next) {
    // res.clearCookie('id');
    client.do.logout({}, req, res, function(err, result, headers) {
        res.redirect('/');
    });
}

function info(req, res) {
    async.auto({
        sysmsglist: function(cb) {
            cb(null, {
                total: 2,
                data: [{
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
                }]
            });
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



function doUpload(req, res) {
    var file = req.file;
    if (file.size > 5 * 1024 * 1024) { //too max
        fs.unlink(file.path);
        return res.end('error|文件超出空间范围（5M），请扩容！'); //富文本编辑器error格式
    }
    var path = req.file.path;
    /*unzip*/
}

function doUploadErr(err, req, res, next) {
    // if (err) return res.json({
    //     error: err.toString()
    // });
    if (err) return res.end('error|' + err.toString());
}
var libUpload = require('../lib/upload');
router.route('/upload/img').post(libUpload.single('前端叫什么名字name'), doUpload, doUploadErr);

module.exports = router;
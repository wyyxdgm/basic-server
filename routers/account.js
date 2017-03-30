var router = require("express").Router();
var async = require('async');
var _ = require('underscore');
var libDate = require("../lib/date");
var Logger = require('../lib/log');
var libString = require('../lib/string');
var libUtils = require("../lib/utils");
var redis = libDb.redisClient;
var config = require("../config");
/* common business*/
var AuthController = require("../controller/authController");

function signin(req, res) {
    return res.render('account/signin');
}


function dosigninErrorFilter(err, req, res, next) {
    if (err) return res.send({
        error: err
    });
    return next();
}

function dosignin(req, res) {
    // issue a remember me cookie if the option was checked
    req.body.remember_me = req.body.remember_me == 'true';
    var goto = req.flash('goto');
    if (goto.length > 0) goto = goto[0];
    else goto = '';
    if (req.body.remember_me) {
        return AuthController.issueToken(req.user, function(err, token) {
            if (err) return res.send({
                error: '系统错误'
            });
            res.cookie('remember_me', token, {
                path: '/',
                httpOnly: true,
                maxAge: 604800000
            }).send({
                success: true,
                goto: goto
            });
        });
    }
    return res.send({
        success: true,
        goto: goto
    });
}

function dosignup(req, res) {
    req.body.ip = req._ip;
    req.body.address = req._ip_address;
    accountController.signup(req.body, function(err, account) {
        if (err) return res.send({
            error: err
        });
        emailController.do_notifyUserForCreateAccount(account._id, {
            signuptime: account.time || new Date(),
            email: account.email
        });
        sysmsgController.do_notifyUserForCreateAccount(account._id, {
            signuptime: account.time || new Date(),
            email: account.email
        });
        require('passport').authenticate('local')(req, res, function() {
            req.session.save(function(err) {
                if (err) return res.send({
                    error: '系统错误'
                });
                return res.send({
                    success: true
                });
            });
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
        sysmsglist: async.apply(libDb.getModel("sysmsg").bcolect, {
            userid: req.user._id,
            delflag: 1
        }, {
            $sort: {
                time: -1
            }
        })
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
    libDb.getModel("sysmsg").bcolect({
        userid: req.user._id,
        delflag: 1
    }, {
        $sort: {
            time: -1
        }
    }, function(err, pageData) {
        if (err) return res.redirect('/500');
        var pagination = libUtils.pagingList(pageData.data, req.query.pageIndex, 5);
        return res.render('page/sysmsg', {
            user: req.user,
            libDate: libDate,
            sysmsgSchema: schemaController.require('sysmsg'),
            sysmsglist: pagination.data,
            pagination: pagination
        });
    });
}

function orderrequestPage(req, res) {
    libDb.getModel("orderrequest").bcolect({
        userid: req.user._id
    }, {
        $sort: {
            time: -1
        }
    }, function(err, pageData) {
        if (err) return res.redirect('/500');
        var pagination = libUtils.pagingList(pageData.data, req.query.pageIndex, 5);
        return res.render('page/orderrequest', {
            orderrequestSchema: schemaController.require('orderrequest'),
            user: req.user,
            utils: libUtils,
            libDate: libDate,
            _: _,
            orderrequestlist: pagination.data,
            pagination: pagination
        });
    });
}

function sysmsgUpdate(req, res) {
    if (req.params.method == 'update') {
        if (!req.body || !req.body._id || !req.body.isread) return res.send({
            error: '参数错误'
        });
        libDb.getModel('sysmsg').update({
            _id: libDb.ObjectId(req.body._id)
        }, {
            isread: req.body.isread
        }, function(err, result) {
            if (err) {
                return res.send({
                    error: '系统错误'
                });
                Logger.error(err);
            }
            return res.send({
                success: true
            });
        });
    } else if (req.params.method == 'updateall') {
        if (!req.body || !req.body.isread) return res.send({
            error: '参数错误'
        });
        libDb.getModel('sysmsg').bupdate({
            userid: libDb.ObjectId(req.user._id)
        }, {
            isread: req.body.isread
        }, function(err, result) {
            if (err) {
                return res.send({
                    error: '系统错误'
                });
                Logger.error(err);
            }
            return res.send({
                success: true
            });
        });
    } else if (req.params.method == 'delete') {
        if (!req.body || !req.body._id) return res.send({
            error: '参数错误'
        });
        libDb.getModel('sysmsg').update({
            _id: libDb.ObjectId(req.body._id)
        }, {
            delflag: 0
        }, function(err, result) {
            if (err) {
                return res.send({
                    error: '系统错误'
                });
                Logger.error(err);
            }
            return res.send({
                success: true
            });
        })
    } else if (req.params.method == 'deleteall') {
        if (!req.body) return res.send({
            error: '参数错误'
        });
        libDb.getModel('sysmsg').bupdate({
            userid: libDb.ObjectId(req.user._id)
        }, {
            delflag: 0
        }, function(err, result) {
            if (err) {
                return res.send({
                    error: '系统错误'
                });
                Logger.error(err);
            }
            return res.send({
                success: true
            });
        })
    } else return res.send({
        error: 'error'
    });
}

function sendemailcode(req, res) {
    if (!req.body.email || !/(\d{1,15})@qq.com/.exec(req.body.email)) return res.send({
        error: '邮箱格式错误'
    });
    req.body.email = req.body.email.toLowerCase();
    accountController.sendemailcode({
        email: req.body.email,
        qq: req.body.qq || "",
        ip: req._ip
    }, function(err, result) {
        if (err) return res.send({
            error: err
        });
        return res.send(result);
    });
}

function findpassword(req, res) {
    res.render('account/findpassword');
}

function emailforfindpassword(req, res) {
    req.body.ip = req._ip;
    accountController.emailforfindpassword(req.body, function(err, result) {
        if (err) return res.send({
            error: err
        });
        res.send(result);
    })
}

function doresetpassword(req, res) {
    accountController.resetpassword({
        userid: req.user._id,
        email: req.body.email,
        password: req.body.password,
        code: req.body.code
    }, function(err, result) {
        if (err) return res.send({
            error: err
        });
        res.send(result);
    });
}

function resetpassword(req, res) {
    var email = req.params.email;
    res.render('account/resetpassword', {
        email: email
    });
}

function showupdatepaypassword(req, res) {
    res.render('account/updatepaypassword');
}

function showupdatepassword(req, res) {
    res.render('account/updatepassword');
}

function emailupdatepaypassword(req, res) {
    req.body.ip = req._ip;
    accountController.emailupdatepaypassword(req.body, function(err, result) {
        if (err) return res.send({
            error: err
        });
        res.send(result);
    })
}

function updatepaypassword(req, res) {
    accountController.updatepaypassword({
        userid: req.user._id,
        email: req.body.email,
        password: req.body.password,
        code: req.body.code
    }, function(err, result) {
        if (err) return res.send({
            error: err
        });
        res.send(result);
    });
}

router.route('/signup').get(signup);
router.route('/dosignup').post(dosignup);
router.route('/signin').get(signin);
router.route('/dosignin').post(AuthController.midware, dosigninErrorFilter, dosignin);
router.route('/signout').get(AuthController.ensureAuthenticatedCommonRedirect, signout);
router.route('/info').get(AuthController.ensureAuthenticatedCommonRedirect, info);
router.route('/sysmsg/:method').post(AuthController.ensureAuthenticatedCommonJson, sysmsgUpdate);
router.route('/sendemailcode').post(sendemailcode);
router.route('/findpassword').get(findpassword).post(emailforfindpassword);
router.route('/emailupdatepaypassword').post(AuthController.ensureAuthenticatedCommonJson, emailupdatepaypassword);
router.route('/resetpassword/:email').get(resetpassword);
router.route('/doresetpassword').post(doresetpassword);
router.route('/updatepassword').get(AuthController.ensureAuthenticatedCommonRedirect, showupdatepassword);
router.route('/updatepaypassword').get(AuthController.ensureAuthenticatedCommonRedirect, showupdatepaypassword);
router.route('/updatepaypassword').post(AuthController.ensureAuthenticatedCommonJson, updatepaypassword);
// .post(AuthController.ensureAuthenticatedCommonJson, updatepassword);
router.route('/sysmsgpage').get(AuthController.ensureAuthenticatedCommonJson, sysmsgPage);
router.route('/orderrequestpage').get(AuthController.ensureAuthenticatedCommonJson, orderrequestPage);

module.exports = router;
// Load required packages
var passport = require('passport');
var libDb = require("../lib/db");
var libRandom = require('../lib/random');
var Logger = require('../lib/log');
var LocalStrategy = require('passport-local').Strategy;
var RememberMeStrategy = require('passport-remember-me').Strategy;
var config = require('../config');

function findById(id, fn) {
    libDb.getModel('account').select({
        _id: libDb.ObjectId(id)
    }, function(err, account) {
        if (err) return fn(err);
        if (!account) return fn("用户不存在");
        return fn(null, account);
    });
}

function findByUsername(email, fn) {
    libDb.getModel('account').select({
        email: email
    }, function(err, result) {
        if (err) return fn(err);
        if (!result) return fn("用户不存在");
        return fn(null, result);
    });
}

function consumeRememberMeToken(token, fn) {
    libDb.redisClient.get(token, function(err, userid) {
        libDb.redisClient.del(token, function(err, result) {
            fn(null, userid);
        });
    });
}

function saveRememberMeToken(token, uid, fn) {
    libDb.redisClient.set(token, uid, fn);
}

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(username, password, fn) {
        // asynchronous verification, for effect...
        process.nextTick(function() {
            Logger.info('sssssssssssssssssssssssssssssssssssssss', username);
            findByUsername(username, function(err, user) {
                if (err) return fn(err);
                if (!user) return fn('用户不存在');
                if (user.password != password) {
                    return fn('密码错误');
                } else return fn(null, {
                    _id: user._id,
                    email: user.email,
                    token: user.token
                });
            });
        });
    }
));

passport.use(new RememberMeStrategy(
    function(token, done) {
        consumeRememberMeToken(token, function(err, uid) {
            if (err) {
                return done(err);
            }
            if (!uid) {
                return done(null, false);
            }

            findById(uid, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                return done(null, user);
            });
        });
    },
    issueToken
));

module.exports.issueToken = issueToken;

function issueToken(user, done) {
    var token = libRandom.genStr(64);
    saveRememberMeToken(token, user._id, function(err) {
        if (err) {
            return done(err);
        }
        return done(null, token);
    });
}

module.exports.ensureAuthenticated = ensureAuthenticated;

function ensureAuthenticated(redirect, json) {
    return function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        if (redirect !== undefined) {
            res.redirect(redirect);
        } else if (json !== undefined) {
            res.json(json);
        } else {
            return res.status(500).end('');
        }
    }
}
module.exports.ensureAuthenticatedCommonRedirect = ensureAuthenticated('/account/signin');
module.exports.ensureAuthenticatedCommonJson = ensureAuthenticated({
    success: false,
    msg: '未登录，请先登录',
    code: '0001'
});
module.exports.midware = passport.authenticate("local", {
    failureRedirect: '/account/signin'
});
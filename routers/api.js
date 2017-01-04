var router = require('express').Router();
var api = require('../controller/api');
Object.keys(api).forEach(function(key, index) {
    console.log('use path >>>', key);
    router.use(key, function(req, res, next) {
        res.send(api[key]);
    });
});

module.exports = router;
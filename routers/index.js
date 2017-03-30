var async = require('async');
var _ = require('underscore');
var router = require('express').Router();
// var sendJson = require('../lib/response').sendJson;
// var sendErr = require('../lib/response').sendErr;
var config = require('../config');
var Logger = require('../lib/log');
/*router index*/

function renderIndex(req, res) {
	res.render('index', {
		content: '<span style="font-size:20px;line-height:200px;">hellow world</span>'
	});
}

function renderAboutus(req, res) {
	res.render('aboutus', {});
}

router.get('/', renderIndex);
router.get('/index', renderIndex);
router.get('/aboutus', renderAboutus);

module.exports = router;
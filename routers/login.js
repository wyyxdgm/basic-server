var router = require('express').Router();

router.get('/', function(req, res, next) {
    //res.end('这是一个login页面,请填写username,pass');
    // res.redirect('/login');
    res.render('login');
    // res.end('1')
});

router.post('/', function(req, res, next) {
    if (!req.body.username) return res.send('meiyou username');
    if (!req.body.pass) return res.send('meiyou pass');
    // resolve username pass
   //res.end('您成功登录=====>>>>>>>username:' + req.body.username + ';pass:' + req.body.pass);
   // res.redirect('../static/login.html');
});


module.exports = router;
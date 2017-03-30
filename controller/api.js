var config = require('../config');
/*后端模块路径在这里配置*/
var modules = {
    /*后端接口地址*/
    root: config.backendDomain.api,
    accountModule: config.backendDomain.api + 'account/',
    msgModule: config.backendDomain.api + 'msg/',
};
/*提供给client.js使用。后端加接口，node就在这里加*/
module.exports = {
    'getUserInfo': modules.root + 'getUserInfo', //这里配好，就可以直接使用client.js直接请求后端的接口==>client.do.isUserNameUsed({name:'xxx'},function(err,result){})
    'login': modules.accountModule + 'login',
    'logout': modules.accountModule + 'logout',
    'getMessage': modules.msgModule + 'get', //新增返回字段 ： displayType  （  展现方式：0-url方式，1-富文本）
}

/*test/api-server.js模拟了后端api。这里的url配置根据后端来写*/

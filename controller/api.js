var config = require('../config');
/*后端模块路径在这里配置*/
var modules = {
    /*后端接口地址*/
    root: config.backendDomain.api,
    account: config.backendDomain.api + 'account/',
    common: config.backendDomain.api + 'common/',
    reserve: config.backendDomain.api + 'reserve/',
    wnfund: config.backendDomain.api + 'wn/fund/',
    investWisdom: config.backendDomain.api + 'wn/investWisdom/',
    riskquestion: config.backendDomain.api + 'risk/questions/'
};
/*提供给client.js使用。后端加接口，node就在这里加*/
module.exports = {
    'isUserNameUsed': modules.account + 'isUserNameUsed', //这里配好，就可以直接使用client.js直接请求后端的接口==>client.do.isUserNameUsed({name:'xxx'},function(err,result){})
    'register': modules.account + 'register',
    'login': modules.account + 'login',
    'logout': modules.account + 'logout',
    'getCurrentUser': modules.account + 'getCurrentUser',
    'findByType': modules.investWisdom + 'findByType', //新增返回字段 ： displayType  （  展现方式：0-url方式，1-富文本）
    'xxx':
}
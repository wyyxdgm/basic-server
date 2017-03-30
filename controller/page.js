/*use with static/public/tmpl/header.html*/

/*这里统一管理每个页面的标题等信息。为SEO提供便利*/
/**
 * 键值对。
 * 键： res.render的html模板路径。
 * 值：active_menu。激活显示的按钮。配合前端class
 *     title,keywords,description该页面的标题等信息。
 */

var pageConfig = module.exports.pageConfig = {
    'index': {
        active_menu: 'index',
        title: '网站标题',
        keywords: '网站标题',
        description: '网站标题'
    },
    'aboutus': {
        active_menu: 'aboutus',
        title: '网站标题',
        keywords: '网站标题',
        description: '网站标题'
    },
    'account/info': {
        active_menu: 'account/info',
        title: '网站标题',
        keywords: '网站标题',
        description: '网站标题'
    },
    'account/signin': {
        active_menu: 'account/signin',
        title: '网站标题',
        keywords: '网站标题',
        description: '网站标题'
    }
}
module.exports.getPage = getPage;

function getPage(pageName) {
    if (!pageName || !pageConfig[pageName]) {
        pageName = 'index';
    }
    return pageConfig[pageName];
}

module.exports.genTmpl = genTmpl;

function genTmpl(renderObj, pageName) {
    if (!renderObj) renderObj = {};
    renderObj['page'] = getPage(pageName);
    return renderObj;
}
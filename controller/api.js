var api = {
    '/a': {
        success: true
    },
    '/product/getFundTypes': {
        "success": true,
        data: [{}, {}, {}]
    },
    '/account/wxAppLogin': {
        "success": true,
        "code": "NT-0000",
        "data": "d67e894151b14c58bda4e77c664267db",
        "message": "登录成功",
        "extra": null
    },
    '/account/wxAppLogin': {
        success: true,
        code: 'NT-0015'
    },
    '/account/wxAppLogin': {
        success: false,
        message: 'error test'
    },
    '/account/wxAppBindStep1': {
        success: false,
        message: 'error test'
    },
    '/account/wxAppBindStep1': {
        success: true,
        code: 'NT-0000'
    },
    '/account/wxAppBindStep1': {
        success: true,
        code: 'NT-0016'
    },
    '/account/wxAppBindStep2': {
        success: true,
        code: 'NT-0000'
    },
    '/account/wxAppBindStep2': {
        success: false,
        message: 'error test'
    },
    '/account/wxAppHandleUserInfo': {
        success: true,
        code: 'NT-0000'
    },
    '/account/wxAppHandleUserInfo': {
        success: false,
        message: 'error test'
    },
    '/common/sendEmailCode': {
        success: true,
        code: 'NT-0000'
    },
    '/common/sendEmailCode': {
        success: false,
        message: 'error test'
    },
    '/common/getLunboList': {
        success: false,
        message: 'error test'
    },
    '/common/getLunboList': {
        "success": true,
        "code": "NT-0000",
        "data": [{
            "id": 3,
            "url": "https://wt.qlzqzg.com/static/images/user_register_guide_one.jpg",
            "destUrl": null,
            "destParam": null,
            "createTime": 1477901051000,
            "updateTime": 1477900754000
        }, {
            "id": 2,
            "url": "https://wt.qlzqzg.com/static/images/register_help_one.jpg",
            "destUrl": null,
            "destParam": null,
            "createTime": 1477901046000,
            "updateTime": 1477900749000
        }, {
            "id": 1,
            "url": "https://wt.qlzqzg.com/static/images/aboutus.jpg",
            "destUrl": "https://wt.qlzqzg.com/static/images/sunccess.png",
            "destParam": "aaa",
            "createTime": 1477900294000,
            "updateTime": 1477899998000
        }],
        "message": "success",
        "extra": null
    },
    '/app/headpage': {
        success: true,
        code: 'NT-0000'
    },
    '/app/headpage': {
        success: false,
        message: 'error test'
    }
};

module.exports = api;
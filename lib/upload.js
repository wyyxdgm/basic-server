/**
 *
 * @Description 文件上传配置
 * @Author Amor
 * @Created 2016/04/27 17:50
 * 技术只是解决问题的选择,而不是解决问题的根本...
 * 我是Amor,为发骚而生!
 *
 */
var multer = require('multer');
var Logger = require('../lib/log');
var libRandom = require('../lib/random');
var path = require('path');
var libDate = require('../lib/date');
//添加配置文件到muler对象。
var upload = multer({
    storage: multer.diskStorage({
        //设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
        //Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
        destination: config.upload,
        filename: function(req, file, cb) {
            Logger.info('file+++>', file, file.originalname);
            //构造文件名称
            cb(null, libDate.getDate(new Date()) + libRandom.genStr(10) + '-' + path.extname(file.originalname));
        }
    }),
    //其他设置请参考multer的limits
    limits: {
        fileSize: 50000000 //50M
    },
    fileFilter: function(req, file, cb) { //文件过滤，可以过滤格式等
        console.log('fileFilter', file);
        //比如要求传jpg，就这样写
        if (path.extname(file.originalname) !== ".jpg") return cb('error|请上传jpg格式的压缩包'); //这个格式是那个富文本编辑器约定的错误格式：error|错误信息
        cb(null, true);
    }
});
//导出对象
module.exports = upload;
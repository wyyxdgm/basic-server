# basic-server
node 入门


##使用步骤
#clone
git clone git@github.com:wyyxdgm/basic-server.git
#包安装
cd basic-server
npm install
bower install
cd test && npm install
cd -

#启动后端的模拟环境。
#（可以忽略这里边的代码。需要注意这里边的端口是8080，如果需要可以该成别的端口。前端的config.js需要相应的配置后端api地址）
node test/api-server.js

#启动前端node服务
node server.js

#接下来可以访问本地服务了
http://127.0.0.1:3000


################################################
日志默认目录：
/var/web/basic-server/log
如果没有这个目录需要事先穿件
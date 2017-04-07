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


pm2常用命令

#加 --name 可以起一个名字
如：
pm2 start server.js --name basic

#pm2 stop 可以关闭服务(关闭了，还会在[pm2 list]列表中)
如：
pm2 stop basic

#pm2 delete 可以关闭并删除服务
如：
pm2 delete basic

#pm2 monit 可以检测所有pm2启动的服务
如：
pm2 monit

#pm2 list 可以查看当前所有服务（包括stop掉的）
如：
pm2 list

#pm2 logs 可以查看当前所有服务日志输出，可以加名字输出特定的服务的日志
如：
pm2 logs
pm2 logs basic


一般命令：
pm2 start server.js --name basic -p process.pid -l log.log -o out.log -e err.log

解读：--name命名,到时候可以pm2 delete basic关掉。
	-p 加pid文件路径。会把进程的id输出到这个文件中。
	-l 正确的日志会输出到这个文件路径。
	-o 所有的日志会输出到这个文件路径。
	-e 错误的日志会输出到这个文件路径。
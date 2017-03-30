#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )
cd $DIR && echo '==>> ' $DIR
echo '=========================================='

DATE=`date +%Y%m%d`
PROJECT_NAME=basic-server
WEB_DIR=/var/web/${PROJECT_NAME}/

PID_DIR=${WEB_DIR}pid/server-node/
PID_FILE=${PID_DIR}server.pid

SERVER_NAME=${PROJECT_NAME}-server
SERVER_FILE=server.js
LOG_CRON=${WEB_DIR}log/cron/

LOG_DIR=${WEB_DIR}log/
LOG_LOG=${LOG_DIR}server-log.log
LOG_OUT=${LOG_DIR}server-out.log
LOG_ERR=${LOG_DIR}server-err.log

#--stop service
bash ./bin/stop-server.sh

#--check directories
if [ ! -d ${WEB_DIR} ]; then
	mkdir -p ${WEB_DIR}
fi

if [ ! -d ${PID_DIR} ]; then
	mkdir -p ${PID_DIR}
fi

if [ ! -d ${LOG_DIR} ]; then
	mkdir -p ${LOG_DIR}
fi

#--install crontab
#crontab bin/cron/crontab.txt
#echo "cron installed success!"

#service cron start
#echo "cron started success!"

#service mongod start
#echo "mongod start success!"


#--start service
echo "pm2 start ${SERVER_FILE} --name ${SERVER_NAME} -p ${PID_FILE} -l ${LOG_LOG} -o ${LOG_OUT} -e ${LOG_ERR}"
pm2 start ${SERVER_FILE} --name ${SERVER_NAME} -p ${PID_FILE} -l ${LOG_LOG} -o ${LOG_OUT} -e ${LOG_ERR}

exit  0;
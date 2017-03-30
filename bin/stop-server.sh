#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )
cd $DIR && echo '==>> ' $DIR
echo '=========================================='

DATE=`date +%Y%m%d`
PROJECT_NAME=basic-server

WEB_DIR=/var/web/${PROJECT_NAME}/

PID_DIR=${WEB_DIR}pid/server-node/
PID_FILE=${PID_DIR}server.pid

SERVER_NAME=e-server
SERVER_FILE=server.js

LOG_DIR=${WEB_DIR}log/
LOG_LOG=${LOG_DIR}server-log.log
LOG_OUT=${LOG_DIR}server-out.log
LOG_ERR=${LOG_DIR}server-err.log

#--stop service
pm2 delete $SERVER_NAME
exit 0;
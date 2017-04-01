#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )
cd $DIR && echo '==>> ' $DIR
echo '=========================================='

npm install
cd test && npm install
cd -

#普通用户执行
bower install 

#root用户执行
#bower install --allow-root



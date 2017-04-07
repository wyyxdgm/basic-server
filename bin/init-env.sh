#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )
cd $DIR && echo '==>> ' $DIR
echo '=========================================='

apt-get update  
#node
apt-get install -y python-software-properties software-properties-common  
add-apt-repository ppa:chris-lea/node.js  
apt-get update  
apt-get install nodejs
#git
sudo apt-get install git -y
#npm packages
npm install -g bower
npm install -g pm2

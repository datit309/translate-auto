#!/bin/bash
# abort on errors
set -e

#DOMAIN='big-ex.com'
# directory website
#cd /home/kanni/web/${DOMAIN}/public_html/bigex/interface

echo "================> Update new code"
git pull

echo "================> Install modules"
yarn

echo "================> Build folder website"
yarn build-testnet

echo "================> Copy env"
cp .env.testnet .env

echo "================> Chown permissions"
chown -R robert:robert /home/robert/web

echo "================> Delete pm2"
pm2 delete ecosystem.config.js

echo "================> Start pm2"
pm2 start ecosystem.config.js

echo -e '\nHit [Ctrl]+[D] to exit this child shell.'
$SHELL

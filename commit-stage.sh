#!/bin/sh
set -e
set -u

npm install
npm -g install grunt-cli istanbul bower
git config --global user.name jenkins
git config --global user.email jenkins@eyeos.com
grunt commit-stage

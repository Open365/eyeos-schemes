#!/bin/bash
set -e
set -u

sudo yum -y install \
	nodejs \
	npm

sudo npm install -g \
	grunt-cli

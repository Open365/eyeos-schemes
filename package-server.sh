#!/bin/bash
set -e
set -u

cd "$(dirname "$0")"

npm install
grunt publish-npm

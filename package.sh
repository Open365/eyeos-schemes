#!/bin/bash
set -e
set -u

cd "$(dirname "$0")"

./package-server.sh
./package-browser.sh

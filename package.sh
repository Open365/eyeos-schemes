#!/bin/sh

set -e
set -u
set -x

BUILDDIR="./build-browser"
PKGDIR="pkgs"

bower --allow-root install

if [ -d "$BUILDDIR" ]; then
    rm -rf $BUILDDIR
fi

if [ -d "$PKGDIR" ]; then
    rm -rf $PKGDIR
fi

mkdir $PKGDIR
mkdir $BUILDDIR

grunt build-client --release

tar -czvf pkgs/eyeosScheme.tar.gz $BUILDDIR bower.json

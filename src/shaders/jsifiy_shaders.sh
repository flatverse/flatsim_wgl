#!/bin/bash

rm -rf build
mkdir -p build

if [ $# -eq 0 ]; then
  ./jsifiy_shaders.sh *.glsl
  exit 0
fi

while test $# -gt 0
do
########################################
# change these if you need to
########################################
  js_framework_name="gltile"
  js_path_to_sources="shaders.sources"
########################################

  dname=$(dirname $1)
  bname=$(basename ${1%.*})
  nfname="build/$bname.js"
  rm -f "$nfname"
  touch "$nfname"

  echo "(function (scope) {" >> "$nfname"
  echo "scope.$js_path_to_sources.$bname = ''" >> "$nfname"

  # taken from http://stackoverflow.com/a/10929511
  while IFS='' read -r line || [[ -n "$line" ]]; do
    echo "+ '$line\n'" >> "$nfname"
  done < "$1"

  echo ";" >> "$nfname"
  echo "})(window.$js_framework_name);" >> "$nfname"

  shift
done

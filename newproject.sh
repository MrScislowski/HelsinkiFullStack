#!/bin/bash

part="part2"
appname="countries"

cd $part
pnpm create vite $appname --template react
cd $appname
rm -r public/ src/assets src/App.css src/index.css .eslintrc.cjs
echo "" > README.md


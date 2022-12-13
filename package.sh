#!/bin/bash
rm -rf dist
mkdir -p dist
cp node_modules/normalize.css/normalize.css dist/
cp -R src/img dist
cp src/*.html dist/
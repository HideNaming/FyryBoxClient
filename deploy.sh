#!/bin/sh

git pull
npm install
npm run build
pm2 start
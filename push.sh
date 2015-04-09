#!/bin/sh
git status
read -p "Press smth to git add -A"
git add -A
git status
read -p "Press smth to git commit with comment" $1
git commit -m $1
read -p "Press smth to git push origin master"
git push origin master

#!/bin/sh

if [ -z "$1" ]; then
	echo "Usage $0 <comment>";
else
	git status

	echo "\n\n"
	read -p "Press smth to git add -A"
	git add -A
	git status

	echo "\n\n"
	read -p "Press smth to git commit with comment $1" 
	git commit -m "$1"

	echo "\n\n"
	read -p "Press smth to git push origin master"
	git push origin master
fi

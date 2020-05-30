#!/usr/bin/env sh
if [ $# -eq 2  ]
then
   echo "missing commit message"
   exit 1
fi


git add .
git commit -am "AutoDeploy: $0 - $1"
git push
hexo deploy

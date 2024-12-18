#!/bin/bash

# before your first time using this, run 'chmod +x git-pull.sh'
# in your terminal where this file is hosted
# to make it executable
# you only have to do this once per file and parent folder

# then to execute this script
# run './git-pull.sh' in your terminal where this file is hosted and executable

# the script will go through each directory // folder in the current folder where this file is hosted
# and check if the directory // folder is a git repository
# if so, it will run 'git fetch origin --prune' and then 'git pull'

for dir in */ ; do
    if [ -d "$dir/.git" ]; then
        echo "Updating repository in $dir"
        cd "$dir" || continue
        git fetch origin --prune
        git pull
        cd ..
    else
        echo "Skipping $dir (not a git repository)"
    fi
done

echo "Done git pulling all repositories."
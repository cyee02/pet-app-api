# chmod +x bin/teardown

#!/bin/bash

set -euo pipefail

CURRENT_DIR=$(pwd)
ROOT_DIR="$( dirname "${BASH_SOURCE[0]}" )"/..
STACK_NAME=pet-app-api

cd $ROOT_DIR

echo "tearing down application.."
aws cloudformation delete-stack --stack-name $STACK_NAME

echo "teardown complete"

cd $CURRENT_DIR
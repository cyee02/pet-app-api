# chmod +x bin/deploy

#!/bin/bash

set -euo pipefail

CURRENT_DIR=$(pwd)
ROOT_DIR="$( dirname "${BASH_SOURCE[0]}" )"/..
STACK_NAME=pet-app-api

cd $ROOT_DIR

echo "deploying application.."
aws cloudformation deploy \
  --template-file $ROOT_DIR/template.yaml \
  --stack-name $STACK_NAME \
  --capabilities CAPABILITY_NAMED_IAM

echo "deployed"

cd $CURRENT_DIR
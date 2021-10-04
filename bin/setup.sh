# chmod +x bin/deploy

#!/bin/bash

CURRENT_DIR=$(pwd)
ROOT_DIR="$( dirname "${BASH_SOURCE[0]}" )"/..
OUTPUT=$(python3 ${ROOT_DIR}/bin/setup.py)

eval $OUTPUT

echo $PARAMETERS
echo $APP_NAME

cd $ROOT_DIR

echo "deploying setup.."
aws cloudformation deploy \
  --template-file $ROOT_DIR/cfn-template/setup.yaml \
  --stack-name $APP_NAME \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides $PARAMETERS

cd $CURRENT_DIR
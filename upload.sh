#!/bin/sh

# bin/upload-avatar.sh -- final revision

curl $1 \
  -F operations='{ "query": "mutation ($file: Upload) { uploadImage(image: $file) }", "variables": { "file": null } }' \
  -F map='{ "0": ["variables.file"] }' \
  -F 0=@$2
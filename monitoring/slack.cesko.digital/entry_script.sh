#!/bin/sh

# https://docs.aws.amazon.com/lambda/latest/dg/images-test.html

if [ -z "${AWS_LAMBDA_RUNTIME_API}" ]; then
  exec /usr/local/bin/aws-lambda-rie /usr/local/bin/npx aws-lambda-ric $@
else
  exec /usr/local/bin/npx aws-lambda-ric $@
fi

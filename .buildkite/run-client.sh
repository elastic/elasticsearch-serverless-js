#!/usr/bin/env bash
#
# Once called Elasticsearch should be up and running
#
script_path=$(dirname "$(realpath -s "$0")")
set -euo pipefail
repo=$(pwd)

export NODE_VERSION=${NODE_VERSION:-16}

echo "--- :docker: Building Docker image"
docker build \
       --file "$script_path/Dockerfile" \
       --tag elastic/elasticsearch-serverless-js \
       --build-arg NODE_VERSION="$NODE_VERSION" \
       --build-arg BUILDER_USER="$(id -u)" \
       --build-arg BUILDER_GROUP="$(id -g)" \
       .

echo "--- :javascript: Running tests"

GITHUB_TOKEN=$(vault read -field=token "$GITHUB_TOKEN_PATH")
export GITHUB_TOKEN

mkdir -p "$repo/junit-output"
docker run \
       -u "$(id -u):$(id -g)" \
       -e "ELASTICSEARCH_URL" \
       -e "ES_API_SECRET_KEY" \
       -e "GITHUB_TOKEN" \
       -e "BUILDKITE" \
       --volume "$repo/junit-output:/usr/src/app/junit-output" \
       --name elasticsearch-serverless-js \
       --rm \
       elastic/elasticsearch-serverless-js \
       bash -c "npm run test:integration"

if [ -f "$repo/junit-output/serverless-report-junit.xml" ]; then
  mv "$repo/junit-output/serverless-report-junit.xml" "$repo/junit-output/junit-$BUILDKITE_JOB_ID.xml"
else
  echo 'No JUnit artifact found'
fi

#!/usr/bin/env bash

set -euo pipefail

script_path=$(dirname "$(realpath -s "$0")")

# start up a serverless project
source "$script_path/create-serverless.sh"

# ensure serverless project is deleted when job ends
trap cleanup EXIT

# spin up serverless instance
start_serverless

# run integration tests
bash "$script_path/run-client.sh"

#!/usr/bin/env bash

set -ue

which watchexec
exec watchexec \
  --watch contracts \
  --restart \
  --wrap-process=none \
  --exts sol,toml ./scripts/eth-deploy.sh

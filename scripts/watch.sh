#!/usr/bin/env bash

set -ue

watchexec \
  --watch contracts \
  --restart \
  --exts sol,toml ./scripts/deploy.sh

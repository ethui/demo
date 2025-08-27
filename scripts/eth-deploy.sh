#!/usr/bin/env bash

export MNEMONIC="test test test test test test test test test test test junk"
export SENDER="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

forge soldeer update

forge build
sleep 0.2
out=$(forge script DevDeployScript \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --mnemonics "$MNEMONIC" \
  --sender "$SENDER")
result=$?

yarn run wagmi generate

if [ $result -eq 0 ]; then
  clear
fi

echo "$out" | grep -A 5 "Logs"

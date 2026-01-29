#!/usr/bin/env bash

export MNEMONIC="test test test test test test test test test test test junk"
export SENDER="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

forge soldeer update

forge build
sleep 0.2


function deploy {
  rpc=$1
  cast rpc anvil_reset --rpc-url $rpc
  forge script DevDeployScript \
    --rpc-url $rpc \
    --broadcast \
    --mnemonics "$MNEMONIC" \
    --sender "$SENDER"
}

# deploy to local anvil
local=$(deploy "http://localhost:8545")
local_result=$?

# deploy to remote stack
stack=$(deploy "https://hello-world.stacks.ethui.dev/FonXHADNhx3vSzQECV6uz4vNxndkdk36c")
stack_result=$?

yarn run wagmi generate

if [ $result -eq 0 ] && [ $stack_result -eq 0 ]; then
  clear
fi

echo "Local:\n$local\n\nStack:\n$stack" | grep -A 5 "Logs"

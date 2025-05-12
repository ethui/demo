#!/usr/bin/env bash

mnemonic="test test test test test test test test test test test junk"
sender="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

mode=${1:-"local"}

if [ "$mode" == "local" ]; then
  rpc="http://localhost:8545"
elif [ "$mode" == "local-stacks" ]; then
  rpc="http://demo.stacks.lvh.me:4000"
fi

forge soldeer update
forge build
forge script DevDeployScript --rpc-url $rpc --broadcast --mnemonics "$mnemonic" --sender $sender --slow
yarn run wagmi generate

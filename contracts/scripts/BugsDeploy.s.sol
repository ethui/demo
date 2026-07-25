// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

import {OwnedRegistry} from "contracts/bugs/OwnedRegistry.sol";

// Seeds the broken on-chain state the MCP debug demo relies on.
// See docs/mcp-debug-runbook.md.
contract BugsDeployScript is Script {
    address alice = address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
    address bob = address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8);

    function run() public {
        vm.startBroadcast();

        // Scenario 2: owned by bob, while ethui's active account is alice.
        OwnedRegistry registry = new OwnedRegistry(bob);
        console.log("OwnedRegistry", address(registry));

        vm.stopBroadcast();
    }
}

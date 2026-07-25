// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

import {OwnedRegistry} from "contracts/bugs/OwnedRegistry.sol";
import {SixDecimalToken} from "contracts/bugs/SixDecimalToken.sol";
import {Vault} from "contracts/bugs/Vault.sol";
import {DepositToken} from "contracts/bugs/DepositToken.sol";
import {Forwarder} from "contracts/bugs/Forwarder.sol";

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

        // Scenario 3: 6 decimals, funded so the balance reads as a round 100.
        SixDecimalToken sixDecimalToken = new SixDecimalToken();
        sixDecimalToken.mint(alice, 100e6);
        sixDecimalToken.mint(bob, 100e6);
        console.log("SixDecimalToken", address(sixDecimalToken));

        // Scenario 4: funded accounts, deliberately zero approvals.
        DepositToken depositToken = new DepositToken();
        depositToken.mint(alice, 100e18);
        depositToken.mint(bob, 100e18);
        Vault vault = new Vault(depositToken);
        console.log("DepositToken", address(depositToken));
        console.log("Vault", address(vault));

        // Scenario 5: forwards into the bob-owned registry, so the inner call
        // always reverts and is swallowed.
        Forwarder forwarder = new Forwarder();
        console.log("Forwarder", address(forwarder));

        vm.stopBroadcast();
    }
}

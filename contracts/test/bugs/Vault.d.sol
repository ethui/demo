// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// INVERTED TEST: this passes while the demo bug is present. Do not "fix" it.
// Scenario 4 depends on deposit reverting when the caller has not approved.

import {Test} from "forge-std/Test.sol";

import {Vault} from "contracts/bugs/Vault.sol";
import {VaultToken} from "contracts/bugs/VaultToken.sol";

contract VaultTest is Test {
    address alice = address(0xA11CE);

    VaultToken token;
    Vault vault;

    function setUp() public {
        token = new VaultToken();
        vault = new Vault(token);
        token.mint(alice, 100e18);
    }

    function test_deposit_revertsWithoutApproval() public {
        vm.prank(alice);
        vm.expectRevert();
        vault.deposit(10e18);
    }

    function test_deposit_succeedsAfterApproval() public {
        vm.startPrank(alice);
        token.approve(address(vault), 10e18);
        vault.deposit(10e18);
        vm.stopPrank();

        assertEq(vault.deposits(alice), 10e18);
    }
}

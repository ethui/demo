// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// INVERTED TEST: this passes while the demo bug is present. Do not "fix" it.
// Scenario 4 depends on deposit reverting when the caller has not approved.

import {Test} from "forge-std/Test.sol";
import {IERC20Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";

import {Vault} from "contracts/bugs/Vault.sol";
import {DepositToken} from "contracts/bugs/DepositToken.sol";

contract VaultTest is Test {
    address alice = address(0xA11CE);

    DepositToken token;
    Vault vault;

    function setUp() public {
        token = new DepositToken();
        vault = new Vault(token);
        token.mint(alice, 100e18);
    }

    function test_deposit_revertsWithoutApproval() public {
        vm.prank(alice);
        vm.expectRevert(
            abi.encodeWithSelector(
                IERC20Errors.ERC20InsufficientAllowance.selector, address(vault), 0, 10e18
            )
        );
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

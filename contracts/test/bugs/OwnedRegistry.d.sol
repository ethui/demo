// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// INVERTED TEST: this passes while the demo bug is present. Do not "fix" it.
// Scenario 2 depends on setValue reverting for a non-owner caller.

import {Test} from "forge-std/Test.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {OwnedRegistry} from "contracts/bugs/OwnedRegistry.sol";

contract OwnedRegistryTest is Test {
    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    OwnedRegistry registry;

    function setUp() public {
        registry = new OwnedRegistry(bob);
    }

    function test_setValue_revertsForNonOwner() public {
        vm.prank(alice);
        vm.expectRevert(
            abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice)
        );
        registry.setValue(42);
    }

    function test_setValue_succeedsForOwner() public {
        vm.prank(bob);
        registry.setValue(42);
        assertEq(registry.value(), 42);
    }
}

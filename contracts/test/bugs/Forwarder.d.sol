// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// INVERTED TEST: this passes while the demo bug is present. Do not "fix" it.
// Scenario 5 depends on forward() swallowing a failed inner call: the outer
// transaction succeeds and emits Forwarded even though nothing changed.

import {Test} from "forge-std/Test.sol";

import {Forwarder} from "contracts/bugs/Forwarder.sol";
import {OwnedRegistry} from "contracts/bugs/OwnedRegistry.sol";

contract ForwarderTest is Test {
    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    Forwarder forwarder;
    OwnedRegistry registry;

    function setUp() public {
        forwarder = new Forwarder();
        registry = new OwnedRegistry(bob);
    }

    function test_forward_swallowsFailure() public {
        bytes memory data = abi.encodeCall(OwnedRegistry.setValue, (42));

        vm.prank(alice);
        bool success = forwarder.forward(address(registry), data);

        assertFalse(success);
        assertEq(registry.value(), 0);
    }

    function test_forward_emitsEvenWhenInnerCallFails() public {
        bytes memory data = abi.encodeCall(OwnedRegistry.setValue, (42));

        vm.expectEmit(true, false, false, true);
        emit Forwarder.Forwarded(address(registry), data);

        vm.prank(alice);
        forwarder.forward(address(registry), data);
    }
}

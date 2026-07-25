// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// INVERTED TEST: this passes while the demo bug is present. Do not "fix" it.
// Scenario 3 depends on this token reporting 6 decimals, not 18.

import {Test} from "forge-std/Test.sol";
import {IERC20Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";

import {SixDecimalToken} from "contracts/bugs/SixDecimalToken.sol";

contract SixDecimalTokenTest is Test {
    address alice = address(0xA11CE);

    SixDecimalToken token;

    function setUp() public {
        token = new SixDecimalToken();
        token.mint(alice, 100e6);
    }

    function test_decimals_isSix() public view {
        assertEq(token.decimals(), 6);
    }

    function test_transfer_revertsWhenAmountUsesEighteenDecimals() public {
        vm.prank(alice);
        vm.expectRevert(
            abi.encodeWithSelector(
                IERC20Errors.ERC20InsufficientBalance.selector, alice, 100e6, 100e18
            )
        );
        token.transfer(address(0xB0B), 100e18);
    }
}

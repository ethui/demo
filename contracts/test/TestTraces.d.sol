pragma solidity ^0.8.13;

import {TestTraces} from "../TestTraces.sol";

import {Test} from "forge-std/Test.sol";

contract TestTracesTest is Test {
    TestTraces tt;

    function setUp() public {
        tt = new TestTraces();
    }

    function test_call_function() public view {
        assert(tt.call_get_value() == 42);
    }
}

pragma solidity ^0.8.13;

import {TestTracesDelegateCallsCallee, TestTracesDelegateCallsCaller} from "../TestTracesDelegateCalls.sol";

import {Test} from "forge-std/Test.sol";

contract TestTracesDelegateCallsTest is Test {
    TestTracesDelegateCallsCaller caller;
    TestTracesDelegateCallsCallee callee;

    function setUp() public {
        caller = new TestTracesDelegateCallsCaller();
        callee = new TestTracesDelegateCallsCallee();

        caller.setCalleeAddress(address(callee));
    }

    function test_delegate_call() public {
        caller.delegateSetNumber(42);

        assert(caller.number() == 42);
    }
}

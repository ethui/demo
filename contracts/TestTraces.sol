pragma solidity ^0.8.13;

contract TestTraces {
    function call_get_value() public pure returns (uint256) {
        return get_value();
    }

    function get_value() public pure returns (uint256) {
        return 42;
    }
}

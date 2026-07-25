// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Forwarder {
    event Forwarded(address indexed target, bytes data);

    function forward(address target, bytes calldata data)
        external
        returns (bool)
    {
        (bool success,) = target.call(data);
        emit Forwarded(target, data);
        return success;
    }
}

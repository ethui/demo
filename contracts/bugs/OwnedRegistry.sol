// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract OwnedRegistry is Ownable {
    uint256 public value;

    event ValueSet(uint256 value);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setValue(uint256 newValue) external onlyOwner {
        value = newValue;
        emit ValueSet(newValue);
    }
}

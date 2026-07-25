// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DepositToken is ERC20("VaultToken", "VLT") {
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

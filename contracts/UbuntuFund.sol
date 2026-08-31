// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;


contract UbuntuFund {
    address public immutable administrator;

    constructor() {
        administrator = msg.sender;
    }
}
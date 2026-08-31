// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;


contract UbuntuFund {
    address public immutable administrator;
    mapping(address => bool) public inputters;
    mapping(address => bool) public approvers;
        error AdministratorOnly();
            event InputterUpdated(address indexed account, bool allowed);
            event ApproverUpdated(address indexed account, bool allowed);

    modifier onlyAdministrator() {
        if (msg.sender != administrator) revert AdministratorOnly();
        _;
    }

    constructor() {
        administrator = msg.sender;
    }
        function setInputter(
        address account,
        bool allowed
    ) external onlyAdministrator {
        inputters[account] = allowed;
        emit InputterUpdated(account, allowed);
    }
    function setApprover(
    address account,
    bool allowed
) external onlyAdministrator {
    approvers[account] = allowed;
    emit ApproverUpdated(account, allowed);
}
}
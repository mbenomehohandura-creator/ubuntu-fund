// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;


contract UbuntuFund {
    enum MemberCategory {
    StudentActive,
    StudentCasual,
    JuniorUnder16,
    AlumniWorkingAdultActive,
    AlumniWorkingAdultCasual,
    ExecutiveNonPlaying,
    ExecutiveActive
}

struct Member {
    MemberCategory category;
    bool registered;
}
    address public immutable administrator;
    mapping(address => bool) public inputters;
    mapping(address => bool) public approvers;
    mapping(address => Member) public members;
    mapping(MemberCategory => uint256) public annualFees;
        error AdministratorOnly();
            event InputterUpdated(address indexed account, bool allowed);
            event ApproverUpdated(address indexed account, bool allowed);
            event MemberRegistered(
    address indexed account,
    MemberCategory category
);

    modifier onlyAdministrator() {
        if (msg.sender != administrator) revert AdministratorOnly();
        _;
    }

    constructor() {
        administrator = msg.sender;
        annualFees[MemberCategory.StudentActive] = 30_000;
annualFees[MemberCategory.StudentCasual] = 15_000;
annualFees[MemberCategory.JuniorUnder16] = 12_000;
annualFees[MemberCategory.AlumniWorkingAdultActive] = 50_000;
annualFees[MemberCategory.AlumniWorkingAdultCasual] = 35_000;
annualFees[MemberCategory.ExecutiveNonPlaying] = 20_000;
annualFees[MemberCategory.ExecutiveActive] = 25_000;
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
function registerMember(
    address account,
    MemberCategory category
) external onlyAdministrator {
    members[account] = Member({
        category: category,
        registered: true
    });

    emit MemberRegistered(account, category);
}
}
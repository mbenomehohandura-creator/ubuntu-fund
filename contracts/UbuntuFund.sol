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
struct ExpenseProposal {
    address payable recipient;
    uint256 amount;
    string purpose;
    address inputter;
    uint256 approvalCount;
    bool executed;
}
    address public immutable administrator;
    mapping(address => bool) public inputters;
    mapping(address => bool) public approvers;
    mapping(address => Member) public members;
    mapping(MemberCategory => uint256) public annualFees;
    mapping(uint256 => mapping(address => uint256)) public membershipPaid;
    uint256 public totalSponsorshipIncome;
    uint256 public proposalCount;
uint256 public totalExpenses;
mapping(uint256 => ExpenseProposal) public proposals;
mapping(uint256 => mapping(address => bool)) public hasApproved;
        error AdministratorOnly();
        error InputterOnly();
        error MemberNotRegistered();
        error InvalidAmount();
        error ApproverOnly();
error InvalidRecipient();
error InvalidProposal();
error InputterCannotApprove();
error AlreadyApproved();
error ProposalAlreadyExecuted();
error InsufficientApprovals();
error InsufficientTreasuryBalance();
error PaymentFailed();
            event InputterUpdated(address indexed account, bool allowed);
            event ApproverUpdated(address indexed account, bool allowed);
            event MemberRegistered(
    address indexed account,
    MemberCategory category
);
    event MembershipPaymentRecorded(
    address indexed member,
    uint256 indexed financialYear,
    uint256 amountCents,
    address indexed inputter
);
event SponsorshipReceived(
    address indexed sponsor,
    uint256 amount
);
event ProposalCreated(
    uint256 indexed proposalId,
    address indexed recipient,
    uint256 amount,
    string purpose,
    address indexed inputter
);

event ProposalApproved(
    uint256 indexed proposalId,
    address indexed approver,
    uint256 approvalCount
);

event ProposalExecuted(
    uint256 indexed proposalId,
    address indexed recipient,
    uint256 amount
);
    modifier onlyAdministrator() {
        if (msg.sender != administrator) revert AdministratorOnly();
        _;
    }
    modifier onlyInputter() {
    if (!inputters[msg.sender]) revert InputterOnly();
    _;
}
modifier onlyApprover() {
    if (!approvers[msg.sender]) revert ApproverOnly();
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
function recordMembershipPayment(
    address member,
    uint256 financialYear,
    uint256 amountCents
) external onlyInputter {
    if (!members[member].registered) revert MemberNotRegistered();
    if (amountCents == 0) revert InvalidAmount();

    membershipPaid[financialYear][member] += amountCents;

    emit MembershipPaymentRecorded(
        member,
        financialYear,
        amountCents,
        msg.sender
    );
}function createExpenseProposal(
    address payable recipient,
    uint256 amount,
    string calldata purpose
) external onlyInputter returns (uint256 proposalId) {
    if (recipient == address(0)) revert InvalidRecipient();
    if (amount == 0) revert InvalidAmount();

    proposalId = proposalCount;
    proposalCount += 1;

    proposals[proposalId] = ExpenseProposal({
        recipient: recipient,
        amount: amount,
        purpose: purpose,
        inputter: msg.sender,
        approvalCount: 0,
        executed: false
    });

    emit ProposalCreated(
        proposalId,
        recipient,
        amount,
        purpose,
        msg.sender
    );
}
function approveProposal(
    uint256 proposalId
) external onlyApprover {
    if (proposalId >= proposalCount) revert InvalidProposal();

    ExpenseProposal storage proposal = proposals[proposalId];

    if (proposal.executed) revert ProposalAlreadyExecuted();
    if (msg.sender == proposal.inputter) {
        revert InputterCannotApprove();
    }
    if (hasApproved[proposalId][msg.sender]) {
        revert AlreadyApproved();
    }

    hasApproved[proposalId][msg.sender] = true;
    proposal.approvalCount += 1;

    emit ProposalApproved(
        proposalId,
        msg.sender,
        proposal.approvalCount
    );
}
function executeProposal(
    uint256 proposalId
) external onlyAdministrator {
    if (proposalId >= proposalCount) revert InvalidProposal();

    ExpenseProposal storage proposal = proposals[proposalId];

    if (proposal.executed) revert ProposalAlreadyExecuted();
    if (proposal.approvalCount < 2) {
        revert InsufficientApprovals();
    }
    if (address(this).balance < proposal.amount) {
        revert InsufficientTreasuryBalance();
    }

    proposal.executed = true;
    totalExpenses += proposal.amount;

    (bool success, ) = proposal.recipient.call{
        value: proposal.amount
    }("");

    if (!success) revert PaymentFailed();

    emit ProposalExecuted(
        proposalId,
        proposal.recipient,
        proposal.amount
    );
}function sponsor() external payable {
    if (msg.value == 0) revert InvalidAmount();

    totalSponsorshipIncome += msg.value;

    emit SponsorshipReceived(msg.sender, msg.value);
}
}
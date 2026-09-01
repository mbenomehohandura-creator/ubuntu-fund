# Ubuntu Fund

Ubuntu Fund is a transparent Web3 treasury and membership-fee proof of concept for community sports clubs. It was created to explore an alternative financial system for a hockey club that is struggling to open a suitable bank account.

## Deployed Contract

- Network: Ethereum Sepolia
- Contract address: `0xBa1364e39ac0Dba80F63647cEC5821441dB5E35C`
- Explorer: https://sepolia.etherscan.io/address/0xBa1364e39ac0Dba80F63647cEC5821441dB5E35C

## Features

- Administrator-managed financial year and membership fees
- Member registration with seven membership categories
- Partial, full, and excess membership payments
- Paid, outstanding, and credit balance reporting
- Separate membership and sponsorship income totals
- Public aggregate treasury summary
- Role-based transaction inputters and approvers
- Expense proposals containing a recipient, amount, and purpose
- Two different approvals required before payment
- Inputters cannot approve their own proposals
- Approved proposals can only be executed once
- Custom errors and events for important actions

## Expense Workflow

1. An authorized inputter creates an expense proposal.
2. Two different authorized approvers approve it.
3. The administrator executes the approved proposal.
4. The contract transfers the payment and records it as an expense.
5. The proposal cannot be executed again.

## Technology

- Solidity 0.8.34
- Hardhat 3
- Hardhat Ignition
- viem
- forge-std
- Ethereum Sepolia testnet

## Testing

The repository contains Solidity unit and workflow tests covering permissions, membership payments, sponsorships, balances, approvals, and expense execution.

Run the tests with:

```powershell
npx.cmd hardhat test solidity
# Ubuntu Fund Project Requirements

## 1. Project Origin

My hockey club is currently struggling to open a bank account that can be used to collect membership fees and receive sponsorship payments. Without a suitable central account and a transparent financial system, it is difficult to give members an accurate view of what they owe, what they have paid, whether they have a credit and how club's funds are being used. I want to explore whether a Web3 application can provide a transparent shared treasury while ensuring that only authorized club officials can manage payments.

## 2. Users and Roles

- **Administrator:** The administrator manages authorised roles and financial years.
- **Transaction inputter:** The inputter loads a proposed payment but cannot approve the same proposal.
- **Payment approver:** An approver reviews proposed payments; two separate approvals are required. Eligible aprovers are the Treasurer, Chairperson, Vice Chairperson, and Counsel General.
- **Club member:** A memeber sees club finances and only their own personal fee balance.
- **Sponsor or public visitor:** A sponsor can contribute and see selected public financial information.

## 3. Membership Categories and Fees


The club's financial year runs from January to December. Annual membership fees are divided into two equal instalments. The first instalment is due by 20 February, and the second instalment is due by 10 June.

| Membership category | Annual fee |
| --- | ---: |
| Student - Active Member | N$300 |
| Student - Casual Member | N$150 |
| Junior - Under 16 | N$120 |
| Alumni/Working Adult - Active Member | N$500 |
| Alumni/Working Adult - Casual Member | N$350 |
| Executive Member - Non-Playing | N$200 |
| Executive Member - Active Member | N$250 |

## 4. Membership Payment and Credit Rules


- Members may pay their annual fees in instalments.
- The system must show each member's annual fee, total paid, outstanding balance, and available credit.
- An overpayment must be recorded as member credit rather than automatically refunded.
- Remaining credit must be carried forward as the member's opening credit for the next financial year.
- A member may request a refund when transferring to another club and requesting financial clearance.
- A refund may only be approved when the member has no outstanding membership, uniform, or other club fees.
- Members may only view their own detailed balances.
- Authorised financial officials may view all member balances.

## 5. Treasury Income and Expense Rules

- The treasury must record membership-fee income separately from sponsorship income.
- Monetary sponsorship payments must increase the club's treasury balance.
- Equipment donations must be recorded as non-monetary sponsorships and must not increase the treasury balance.
- Members must be able to view the club's total income, total expenses, and available treasury balance.
- Only a transaction inputter may create a payment proposal.
- Every proposal must include a recipient, amount, and purpose.
- The inputter may not approve the same proposal.
- Two different eligible approvers must approve a proposal before payment.
- A proposal's recipient and amount may not be changed after approval begins.
- An approved payment may only be executed once.
- Proposed, approved, rejected, and completed payments must remain visible in the financial history.

## 6. Certification Minimum Viable Product

The certification version will demonstrate the following complete workflow:

1. An administrator creates a financial year and configures membership fees.
2. The administrator registers a club member and assigns a membership category.
3. The member makes a partial or full membership payment using testnet funds.
4. The application displays the member's paid, outstanding, or credit position.
5. A sponsor contributes testnet funds to the club treasury.
6. A transaction inputter creates an expense proposal.
7. Two different eligible officials approve the proposal.
8. The approved payment is executed once.
9. Members can view aggregate treasury income, expenses, and available balance.
10. Automated tests verify permissions, payments, balances, approvals, and execution.

The certification build is a testnet proof of concept. Testnet cryptocurrency represents payments for demonstration purposes and is not treated as real Namibian dollars.

## 7. Features Deferred Until After Certification

- Automatic transfer of credit into a newly created financial year
- Financial-clearance requests and credit refunds
- Uniform fees and other individual member charges
- Non-monetary equipment-donation inventory
- Restricted sponsorship budgets
- Multiple clubs using the same application
- Production use with real money
- Formal accounting, tax, and regulatory integration


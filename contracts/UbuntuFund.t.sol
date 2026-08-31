// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import {UbuntuFund} from "./UbuntuFund.sol";
import {Test} from "forge-std/Test.sol";


contract UbuntuFundTest is Test {
    UbuntuFund fund;

    function setUp() public {
        fund = new UbuntuFund();
    }

        function test_DeployerBecomesAdministrator() public view {
        assertEq(fund.administrator(), address(this));
    }
       function test_AdministratorCanSetInputter() public {
        address inputter = address(0xBEEF);

        fund.setInputter(inputter, true);

        assertTrue(fund.inputters(inputter));
    } 
        function test_NonAdministratorCannotSetInputter() public {
        address outsider = address(0xCAFE);
        address inputter = address(0xBEEF);

        vm.prank(outsider);
        vm.expectRevert(UbuntuFund.AdministratorOnly.selector);

        fund.setInputter(inputter, true);
    }
    function test_AdministratorCanSetApprover() public {
    address approver = address(0xABCD);

    fund.setApprover(approver, true);

    assertTrue(fund.approvers(approver));
}
function test_NonAdministratorCannotSetApprover() public {
    address outsider = address(0xCAFE);
    address approver = address(0xABCD);

    vm.prank(outsider);
    vm.expectRevert(UbuntuFund.AdministratorOnly.selector);

    fund.setApprover(approver, true);
}
function test_AdministratorCanRegisterMember() public {
    address member = address(0x1234);

    fund.registerMember(
        member,
        UbuntuFund.MemberCategory.StudentActive
    );

    (
        UbuntuFund.MemberCategory category,
        bool registered
    ) = fund.members(member);

    assertEq(
        uint256(category),
        uint256(UbuntuFund.MemberCategory.StudentActive)
    );
    assertTrue(registered);
}
function test_NonAdministratorCannotRegisterMember() public {
    address outsider = address(0xCAFE);
    address member = address(0x1234);

    vm.prank(outsider);
    vm.expectRevert(UbuntuFund.AdministratorOnly.selector);

    fund.registerMember(
        member,
        UbuntuFund.MemberCategory.StudentActive
    );
}
function test_AnnualFeesMatchRequirements() public view {
    assertEq(
        fund.annualFees(UbuntuFund.MemberCategory.StudentActive),
        30_000
    );
    assertEq(
        fund.annualFees(UbuntuFund.MemberCategory.StudentCasual),
        15_000
    );
    assertEq(
        fund.annualFees(UbuntuFund.MemberCategory.JuniorUnder16),
        12_000
    );
    assertEq(
        fund.annualFees(
            UbuntuFund.MemberCategory.AlumniWorkingAdultActive
        ),
        50_000
    );
    assertEq(
        fund.annualFees(
            UbuntuFund.MemberCategory.AlumniWorkingAdultCasual
        ),
        35_000
    );
    assertEq(
        fund.annualFees(UbuntuFund.MemberCategory.ExecutiveNonPlaying),
        20_000
    );
    assertEq(
        fund.annualFees(UbuntuFund.MemberCategory.ExecutiveActive),
        25_000
    );
}
function test_InputterCanRecordTwoMembershipInstalments() public {
    address inputter = address(0xBEEF);
    address member = address(0x1234);

    fund.setInputter(inputter, true);
    fund.registerMember(
        member,
        UbuntuFund.MemberCategory.StudentActive
    );

    vm.startPrank(inputter);
    fund.recordMembershipPayment(member, 2026, 15_000);
    fund.recordMembershipPayment(member, 2026, 15_000);
    vm.stopPrank();

    assertEq(fund.membershipPaid(2026, member), 30_000);
}
function test_NonInputterCannotRecordMembershipPayment() public {
    address outsider = address(0xCAFE);
    address member = address(0x1234);

    vm.prank(outsider);
    vm.expectRevert(UbuntuFund.InputterOnly.selector);

    fund.recordMembershipPayment(member, 2026, 15_000);
}
function test_InputterCannotRecordPaymentForUnknownMember() public {
    address inputter = address(0xBEEF);
    address unknownMember = address(0x1234);

    fund.setInputter(inputter, true);

    vm.prank(inputter);
    vm.expectRevert(UbuntuFund.MemberNotRegistered.selector);

    fund.recordMembershipPayment(
        unknownMember,
        2026,
        15_000
    );
}
function test_InputterCannotRecordZeroPayment() public {
    address inputter = address(0xBEEF);
    address member = address(0x1234);

    fund.setInputter(inputter, true);
    fund.registerMember(
        member,
        UbuntuFund.MemberCategory.StudentActive
    );

    vm.prank(inputter);
    vm.expectRevert(UbuntuFund.InvalidAmount.selector);

    fund.recordMembershipPayment(member, 2026, 0);
}
}
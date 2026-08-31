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
}
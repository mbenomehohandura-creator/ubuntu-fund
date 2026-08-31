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
}
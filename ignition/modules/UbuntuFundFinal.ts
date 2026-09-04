import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("UbuntuFundFinalModule", (m) => {
  const ubuntuFund = m.contract("UbuntuFund");

  return { ubuntuFund };
});
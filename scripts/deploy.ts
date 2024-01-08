import { ethers, upgrades } from "hardhat";
// import upgrades from "@openzeppelin/hardhat-upgrades"

async function main() {
  const AccessManager = await ethers.getContractFactory("AccessManager");
  const upgradeProxy = await upgrades.deployProxy(AccessManager, ['0xdFfe013991993bC3Cc2C5Bc01d44C7d2e2F65ab6'], { initializer: "initialize" });
  await upgradeProxy.waitForDeployment();
  console.log(await upgradeProxy.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

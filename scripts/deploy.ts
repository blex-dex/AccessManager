import hre, { ethers, upgrades } from "hardhat";

// import upgrades from "@openzeppelin/hardhat-upgrades"

async function main() {
  const [owner] = await ethers.getSigners();
  // console.log(await owner.getAddress())
  const AccessManager = await ethers.getContractFactory("AccessManager", owner);
  const signerAddress = await owner.getAddress();
  const upgradeProxy = await upgrades.deployProxy(
    AccessManager,
    [signerAddress],
    {
      initializer: "initialize",
      initialOwner: signerAddress
    }
  );
  await upgradeProxy.waitForDeployment();
  console.log("AccessManager Address", await upgradeProxy.getAddress());
  await verify(await upgradeProxy.getAddress());
}

async function verify(contractAddress: string) {
  return new Promise(function () {
    setTimeout(async () => {
      await hre.run("verify", {
        address: contractAddress
      })
    }, 10000)
  });
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

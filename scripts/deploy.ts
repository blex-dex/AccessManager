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
  console.log(await upgradeProxy.getAddress());

  function verify() {
    return new Promise(function () {
      setTimeout(async () => {
        await hre.run("verify", {
          address: await upgradeProxy.getAddress()
        })
      }, 10000)
    });
  }
  await verify();
}


// await verify();

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { ethers, upgrades } from "hardhat";
// import upgrades from "@openzeppelin/hardhat-upgrades"

const addressJson = {
    scheduler: "",
    guardian: "",
    rewardDistributor: "",
    vaultReward: "",
    accessManager: ""

}
const roleIDJson = {
    scheduler: "1",
    guardian: "2"
}
const delayTime = 10 * 60;

async function main() {
    const [owner] = await ethers.getSigners();
    const AccessManager = await ethers.getContractAt("AccessManager", addressJson.accessManager, owner);
    await AccessManager.grantRole(roleIDJson.scheduler, addressJson.scheduler, delayTime);
    await AccessManager.grantRole(roleIDJson.guardian, addressJson.guardian, delayTime)
    await AccessManager.setTargetFunctionRole(addressJson.rewardDistributor, ['0x18e20a03'], roleIDJson.scheduler)
    await AccessManager.setTargetFunctionRole(addressJson.vaultReward, ['0x854303cf'], roleIDJson.scheduler)
    await AccessManager.setRoleGuardian(roleIDJson.scheduler, roleIDJson.guardian);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

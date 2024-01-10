import { toUtf8Bytes } from "ethers";
import { ethers, upgrades } from "hardhat";
// import upgrades from "@openzeppelin/hardhat-upgrades"

const addressJson = {
    boss: "0x22b147A9e4E513d39775504EB7Db3D674D53d5dd",
    scheduler: "0x3E50Fadf9943282d34F48ACF3E559e690C3022eE",
    guardian: "0x3E50Fadf9943282d34F48ACF3E559e690C3022eE",
    rewardDistributor: "0xaDA61A37A7F95A8e15510352cA714241558d67a9",
    vaultReward: "0xe12C6aBe5C12eBf29093A8bc8336053FeAdAFFBd",
    accessManager: "0xBe215A4f7dC7523fB3A8b395B45a87D2463Fc05A"

}
const roleIDJson = {
    admin: "0",
    scheduler: "1",
    guardian: "2"
}
const delayTime = 10 * 60;
const immediateTime = 0;


async function main() {
    const [owner] = await ethers.getSigners();


    // console.log(ethers.keccak256(toUtf8Bytes("setTokensPerInterval(uint256)")).substring(0, 10))
    // console.log(ethers.keccak256(toUtf8Bytes("setAPR(uint256)")).substring(0, 10))
    const AccessManager = await ethers.getContractAt("AccessManager", addressJson.accessManager, owner);
    await AccessManager.grantRole(roleIDJson.scheduler, addressJson.scheduler, delayTime);
    await AccessManager.grantRole(roleIDJson.guardian, addressJson.guardian, delayTime)
    await AccessManager.setTargetFunctionRole(addressJson.rewardDistributor, ['0x18e20a03'], roleIDJson.scheduler)
    await AccessManager.setTargetFunctionRole(addressJson.vaultReward, ['0x854303cf'], roleIDJson.scheduler)
    await AccessManager.setRoleGuardian(roleIDJson.scheduler, roleIDJson.guardian);
    await AccessManager.grantRole(roleIDJson.admin, addressJson.boss, immediateTime);
    await AccessManager.revokeRole(roleIDJson.admin, owner.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

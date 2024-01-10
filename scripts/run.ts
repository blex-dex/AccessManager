import { toUtf8Bytes } from "ethers";
import { ethers, upgrades } from "hardhat";
import { handleTx } from "./utils";
// import upgrades from "@openzeppelin/hardhat-upgrades"

const addressJson = {
    boss: "0x22b147A9e4E513d39775504EB7Db3D674D53d5dd",
    scheduler: "0x3E50Fadf9943282d34F48ACF3E559e690C3022eE",
    guardian: "0x3E50Fadf9943282d34F48ACF3E559e690C3022eE",
    rewardDistributor: "0xaDA61A37A7F95A8e15510352cA714241558d67a9",
    vaultReward: "0xe12C6aBe5C12eBf29093A8bc8336053FeAdAFFBd",
    accessManager: "0xA8E7A0e4a78F2A9eA212D448942214d66EB21692"

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
    await handleTx(AccessManager.grantRole(roleIDJson.scheduler, addressJson.scheduler, delayTime), "grantRole scheduler role");
    await handleTx(AccessManager.grantRole(roleIDJson.guardian, addressJson.guardian, delayTime), "grantRole guardian role")
    await handleTx(AccessManager.setTargetFunctionRole(addressJson.rewardDistributor, ['0x18e20a03'], roleIDJson.scheduler), "setTargetFunctionRole rewardDistributor setTokensPerInterval")
    await handleTx(AccessManager.setTargetFunctionRole(addressJson.vaultReward, ['0x854303cf'], roleIDJson.scheduler), "setTargetFunctionRole vaultReward setAPR")
    await handleTx(AccessManager.setRoleGuardian(roleIDJson.scheduler, roleIDJson.guardian), "related scheduler to guardian");
    await handleTx(AccessManager.grantRole(roleIDJson.admin, addressJson.boss, immediateTime), "grantRole admin role to boss");
    await handleTx(AccessManager.revokeRole(roleIDJson.admin, owner.address), "revokeRole deployer(operator) admin role ");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

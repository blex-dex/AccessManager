import { ethers, network } from "hardhat";
import { getSolidityFunctionSignature, handleTx } from "./utils";
import { addressJson, roleIDJson, grantDelayTime } from "./config";

const IMMEDIATE_TIME = 0;


async function main() {
    const [owner] = await ethers.getSigners();
    const addressJsonNetwork = addressJson[network.name];
    const AccessManager = await ethers.getContractAt(
      "AccessManagerUpgradeable",
      addressJsonNetwork.accessManager,
      owner
    );
    await handleTx(AccessManager.grantRole(
        roleIDJson.scheduler,
        addressJsonNetwork.scheduler,
        grantDelayTime
    ), "grantRole scheduler role");
    await handleTx(AccessManager.grantRole(
        roleIDJson.guardian,
        addressJsonNetwork.guardian,
        grantDelayTime), "grantRole guardian role");
    await handleTx(AccessManager.setTargetFunctionRole(
        addressJsonNetwork.rewardDistributor,
        [getSolidityFunctionSignature("setTokensPerInterval(uint256)")],
        roleIDJson.scheduler), "setTargetFunctionRole rewardDistributor setTokensPerInterval");
    await handleTx(AccessManager.setTargetFunctionRole(
        addressJsonNetwork.vaultReward,
        [getSolidityFunctionSignature("setAPR(uint256)")],
        roleIDJson.scheduler), "setTargetFunctionRole vaultReward setAPR"
    );
    await handleTx(AccessManager.setRoleGuardian(
        roleIDJson.scheduler,
        roleIDJson.guardian
    ), "related scheduler to guardian");
    await handleTx(AccessManager.grantRole(
        roleIDJson.admin,
        addressJsonNetwork.boss,
        IMMEDIATE_TIME
    ), "grantRole admin role to boss");
    await handleTx(AccessManager.revokeRole(roleIDJson.admin, owner.address), "revokeRole deployer(operator) admin role ");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

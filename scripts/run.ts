import { toUtf8Bytes } from "ethers";
import { ethers } from "hardhat";
import { handleTx } from "./utils";
import { addressJson, roleIDJson, grantDelayTime } from "./config";
const IMMEDIATE_TIME = 0;


async function main() {
  const [owner] = await ethers.getSigners();
  const addressJsonNetwork = addressJson[process.env.HARDHAT_NETWORK];
  // console.log(ethers.keccak256(toUtf8Bytes("setTokensPerInterval(uint256)")).substring(0, 10))
  // console.log(ethers.keccak256(toUtf8Bytes("setAPR(uint256)")).substring(0, 10))
  const AccessManager = await ethers.getContractAt(
    "AccessManager",
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
    grantDelayTime, "grantRole guardian role")
  );
  await handleTx(AccessManager.setTargetFunctionRole(
    addressJsonNetwork.rewardDistributor,
    ["0x18e20a03"],
    roleIDJson.scheduler, "setTargetFunctionRole rewardDistributor setTokensPerInterval")
  );
  await handleTx(AccessManager.setTargetFunctionRole(
    addressJsonNetwork.vaultReward,
    ["0x854303cf"],
    roleIDJson.scheduler, "setTargetFunctionRole vaultReward setAPR")
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

const addressJson = {
  arbitrum_42161: {
    boss: "0x1B6dCB68Ea6C83993D445E2e26b8BA495A2A3bbD",
    guardian: "0x9b99c75674ae72cd573b7d988a50a1d05b693984",
    scheduler: "0x0909F6Fec8E2CB1Aea67B20Efaf31F91b66E88ca",
    rewardDistributor: "0x54c14Fa76eeD09897F09d06580b3add70793CF19",
    vaultReward: "0xBC1502aF0B7bDD34A9631a9A1F6f7773467d2862",
    accessManager: "0x00"
  },
};

const roleIDJson = {
  admin: "0",
  scheduler: "1",
  guardian: "2"
};
const grantDelayTime = 10 * 60;

export { addressJson, roleIDJson, grantDelayTime };

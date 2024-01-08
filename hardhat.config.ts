import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';


// require("dotenv").config();
require("dotenv").config()


// require("@nomiclabs/hardhat-etherscan");



const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
      // url: "https://arb-goerli.g.alchemy.com/v2/demo",
      chainId: 421614,
      accounts: [process.env.TestnetPrivateKey!],
      // gas: 8000000,
      // gasPrice: 25000000000,
      // subgraphName: "arbitrum-sepolia",
    },
    ftmTest: {
      // url: "https://fantom-testnet.public.blastapi.io",
      url: "https://fantom-testnet.public.blastapi.io	",
      chainId: 4002,
      accounts: [
        process.env.TestnetPrivateKey!,
      ]
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  // sourcify: {
  //   enabled: true
  // }

}

export default config;

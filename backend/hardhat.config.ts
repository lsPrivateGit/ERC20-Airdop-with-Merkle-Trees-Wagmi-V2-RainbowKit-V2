import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import dotenv from 'dotenv';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "4932b785db32f19bd6a721173bc97528baa972f9a3253c5d7d824abc2c651682";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "0x155e3615163f82ae0ddeeec17beae1414d9633ac";
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/46ab3c14de474ff2bb04aff99dd62478";
/**
 * BBKIsERC20 deployed to 0x77Ee5Ad24b9B9aec43D10396d5594aA988c37Edf with merkleRoot 0xb984d6e74991b1cb219de68c593fbc69f6113f7a6009b97717468ed851445742
 */
const config: HardhatUserConfig = {
  networks: {
    hardhat: {
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
};

export default config;

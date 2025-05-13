import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20", // Based on Mantle documentation examples
  defaultNetwork: "mantleSepolia",
  networks: {
    hardhat: {
      // Standard Hardhat local network
    },
    mantle: {
      url: "https://rpc.mantle.xyz",
      accounts: [process.env.ACCOUNT_PRIVATE_KEY || ""],
      chainId: 5000,
    },
    mantleSepolia: {
      url: "https://rpc.sepolia.mantle.xyz",
      accounts: [process.env.ACCOUNT_PRIVATE_KEY || ""],
      chainId: 5003,
    },
  },
};

export default config;
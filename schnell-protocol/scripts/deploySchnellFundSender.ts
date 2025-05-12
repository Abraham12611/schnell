import { ethers } from "hardhat";

async function main() {
  const l2StandardBridgeAddress = "0x4200000000000000000000000000000000000010"; // Mantle Sepolia L2 Standard Bridge

  console.log("Deploying SchnellFundSender contract...");

  const SchnellFundSenderFactory = await ethers.getContractFactory("SchnellFundSender");
  const schnellFundSender = await SchnellFundSenderFactory.deploy(l2StandardBridgeAddress);

  await schnellFundSender.waitForDeployment();

  const contractAddress = await schnellFundSender.getAddress();
  console.log(`SchnellFundSender deployed to: ${contractAddress}`);

  console.log("\nTo verify the contract on Mantle Sepolia Explorer, run:");
  console.log(`npx hardhat verify --network mantleSepolia ${contractAddress} "${l2StandardBridgeAddress}"`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
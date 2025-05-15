import { ethers } from "hardhat";
import { SchnellFundSender } from "../typechain-types"; // Adjust path if necessary

async function main() {
  const SCHNELL_FUND_SENDER_CONTRACT_ADDRESS = '0x37E7E8D2a190c5250732cB63eBACb40540258deb'; // Your deployed contract address
  const WMNT_TOKEN_ADDRESS = '0xc0eeCFA24E391E4259B7EF17be54Be5139DA1AC7'; // WMNT token on Mantle Sepolia

  console.log(`Connecting to SchnellFundSender contract at ${SCHNELL_FUND_SENDER_CONTRACT_ADDRESS}...`);

  const [deployer] = await ethers.getSigners(); // The first signer is usually the deployer/owner
  console.log(`Using owner account: ${deployer.address}`);

  const SchnellFundSenderFactory = await ethers.getContractFactory("SchnellFundSender");
  // Cast the attached instance to the specific contract type
  const schnellFundSender = SchnellFundSenderFactory.attach(SCHNELL_FUND_SENDER_CONTRACT_ADDRESS) as SchnellFundSender;

  console.log(`Adding WMNT token (${WMNT_TOKEN_ADDRESS}) to supported tokens...`);

  try {
    const tx = await schnellFundSender.connect(deployer).addSupportedToken(WMNT_TOKEN_ADDRESS);
    console.log("Transaction sent. Hash:", tx.hash);

    await tx.wait();
    console.log("WMNT token added successfully!");

    // Optional: Verify by checking the supportedTokens mapping
    const isSupported = await schnellFundSender.supportedTokens(WMNT_TOKEN_ADDRESS);
    console.log(`Is WMNT token (${WMNT_TOKEN_ADDRESS}) supported now? ${isSupported}`);

  } catch (error) {
    console.error("Error adding supported token:", error);
    process.exitCode = 1;
    return; // Exit if error
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
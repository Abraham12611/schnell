import { ethers } from "hardhat";

async function main() {
  const SCHNELL_FUND_SENDER_CONTRACT_ADDRESS = '0x37E7E8D2a190c5250732cB63eBACb40540258deb';
  const MNT_TOKEN_ADDRESS = '0xB401864b01f89Ee3db4d8e8CD61b9B84F94938B3';

  console.log(`Checking if MNT token is supported...`);

  const SchnellFundSenderFactory = await ethers.getContractFactory("SchnellFundSender");
  const schnellFundSender = await SchnellFundSenderFactory.attach(SCHNELL_FUND_SENDER_CONTRACT_ADDRESS);

  try {
    const isSupported = await schnellFundSender.supportedTokens(MNT_TOKEN_ADDRESS);
    console.log(`Is MNT token (${MNT_TOKEN_ADDRESS}) supported? ${isSupported}`);

    if (!isSupported) {
      console.log("Token is NOT supported. Please run addMntToken.ts first.");
    }
  } catch (error) {
    console.error("Error checking token support:", error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
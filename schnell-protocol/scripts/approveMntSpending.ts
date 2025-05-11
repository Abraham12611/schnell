import { ethers } from "hardhat";

async function main() {
  const SCHNELL_FUND_SENDER_CONTRACT_ADDRESS = '0x37E7E8D2a190c5250732cB63eBACb40540258deb';
  const WMNT_TOKEN_ADDRESS = '0xc0eeCFA24E391E4259B7EF17be54Be5139DA1AC7'; // WMNT token on Mantle Sepolia

  // Approve a very large amount (100,000 WMNT) to avoid future allowance issues
  const APPROVAL_AMOUNT = ethers.parseUnits("100000", 18); // 100,000 WMNT with 18 decimals

  console.log(`Approving SchnellFundSender to spend WMNT tokens...`);

  const [signer] = await ethers.getSigners();
  console.log(`Using account: ${signer.address}`);

  // Get the WMNT token contract interface with additional functions
  const erc20Abi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)",
    "function deposit() external payable",
    "function withdraw(uint256 amount) external"
  ];
  const wmntToken = new ethers.Contract(WMNT_TOKEN_ADDRESS, erc20Abi, signer);

  try {
    // Check token decimals
    const decimals = await wmntToken.decimals();
    console.log(`WMNT Token decimals: ${decimals}`);

    // Check user's balance
    const balance = await wmntToken.balanceOf(signer.address);
    console.log(`Your WMNT balance: ${ethers.formatUnits(balance, decimals)} WMNT`);

    // If WMNT balance is 0, we need to wrap some MNT first
    if (balance === 0n) {
      console.log("No WMNT balance detected. Wrapping 10 MNT to WMNT...");
      const wrapAmount = ethers.parseUnits("10", decimals);
      const wrapTx = await wmntToken.deposit({ value: wrapAmount });
      await wrapTx.wait();
      console.log("Successfully wrapped MNT to WMNT");

      // Check new balance
      const newBalance = await wmntToken.balanceOf(signer.address);
      console.log(`New WMNT balance: ${ethers.formatUnits(newBalance, decimals)} WMNT`);
    }

    // Check current allowance
    const currentAllowance = await wmntToken.allowance(signer.address, SCHNELL_FUND_SENDER_CONTRACT_ADDRESS);
    console.log(`Current allowance: ${ethers.formatUnits(currentAllowance, decimals)} WMNT`);

    if (currentAllowance >= APPROVAL_AMOUNT) {
      console.log("Current allowance is already sufficient!");
      return;
    }

    // Approve spending
    console.log(`Approving ${ethers.formatUnits(APPROVAL_AMOUNT, decimals)} WMNT...`);
    const tx = await wmntToken.approve(SCHNELL_FUND_SENDER_CONTRACT_ADDRESS, APPROVAL_AMOUNT);
    console.log(`Approval transaction sent. Hash: ${tx.hash}`);
    console.log(`View on Explorer: https://explorer.sepolia.mantle.xyz/tx/${tx.hash}`);

    await tx.wait();
    console.log(`Approval confirmed!`);

    // Verify new allowance
    const newAllowance = await wmntToken.allowance(signer.address, SCHNELL_FUND_SENDER_CONTRACT_ADDRESS);
    console.log(`New allowance: ${ethers.formatUnits(newAllowance, decimals)} WMNT`);

    // Double check the allowance is sufficient
    if (newAllowance < APPROVAL_AMOUNT) {
      throw new Error(`Approval failed! New allowance (${ethers.formatUnits(newAllowance, decimals)} WMNT) is less than requested (${ethers.formatUnits(APPROVAL_AMOUNT, decimals)} WMNT)`);
    }

  } catch (error) {
    console.error("Error approving token spending:", error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
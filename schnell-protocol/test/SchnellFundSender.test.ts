import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// Import HardhatEthersSigner for specific typing
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { TransactionReceipt } from "ethers";

// Import TypeChain types assuming they are in root 'typechain-types' folder
import { SchnellFundSender } from "../typechain-types/contracts/SchnellFundSender";
import { MockERC20 } from "../typechain-types/contracts/test/MockERC20";
import { MockL2StandardBridge } from "../typechain-types/contracts/test/MockL2StandardBridge";

describe("SchnellFundSender", function () {
    // Define types for fixture return values
    interface FixtureWallet {
        schnellFundSender: SchnellFundSender;
        mockUsdc: MockERC20;
        mockL2Bridge: MockL2StandardBridge;
        owner: HardhatEthersSigner; // Changed from Signer
        sender: HardhatEthersSigner; // Changed from Signer
        recipient: HardhatEthersSigner; // Changed from Signer
        otherAccount: HardhatEthersSigner; // Changed from Signer
        initialSenderBalance: bigint;
    }

    const MOCK_MESSENGER_ADDRESS = ethers.Wallet.createRandom().address; // Dummy address for messenger

    async function deploySchnellFundSenderFixture(): Promise<FixtureWallet> {
        const [ownerSigner, senderSigner, recipientSigner, otherAccountSigner] = await ethers.getSigners();

        const MockERC20Factory = await ethers.getContractFactory("MockERC20");
        const mockUsdcInstance = await MockERC20Factory.connect(ownerSigner).deploy("Mock USDC", "mUSDC") as MockERC20;

        const MockL2StandardBridgeFactory = await ethers.getContractFactory("MockL2StandardBridge");
        const mockL2BridgeInstance = await MockL2StandardBridgeFactory.connect(ownerSigner).deploy(MOCK_MESSENGER_ADDRESS) as MockL2StandardBridge;

        const SchnellFundSenderFactory = await ethers.getContractFactory("SchnellFundSender");
        const schnellFundSenderInstance = await SchnellFundSenderFactory.connect(ownerSigner).deploy(await mockL2BridgeInstance.getAddress()) as SchnellFundSender;

        const initialSenderBalanceValue = ethers.parseUnits("1000", 6);

        await mockUsdcInstance.connect(ownerSigner).mint(await senderSigner.getAddress(), initialSenderBalanceValue);

        return {
            schnellFundSender: schnellFundSenderInstance,
            mockUsdc: mockUsdcInstance,
            mockL2Bridge: mockL2BridgeInstance,
            owner: ownerSigner, // Direct assignment is fine as getSigners() returns HardhatEthersSigner[]
            sender: senderSigner,
            recipient: recipientSigner,
            otherAccount: otherAccountSigner,
            initialSenderBalance: initialSenderBalanceValue
        };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { schnellFundSender, owner } = await loadFixture(deploySchnellFundSenderFixture);
            expect(await schnellFundSender.owner()).to.equal(await owner.getAddress());
        });

        it("Should set the L2 Standard Bridge address correctly on deployment", async function () {
            const { schnellFundSender, mockL2Bridge } = await loadFixture(deploySchnellFundSenderFixture);
            expect(await schnellFundSender.l2StandardBridge()).to.equal(await mockL2Bridge.getAddress());
        });
    });

    describe("L2 Bridge Configuration", function () {
        it("Owner should be able to set a new L2 Standard Bridge address", async function () {
            const { schnellFundSender, owner } = await loadFixture(deploySchnellFundSenderFixture);
            const newBridgeAddress = ethers.Wallet.createRandom().address;
            await expect(schnellFundSender.connect(owner).setL2StandardBridge(newBridgeAddress))
                .to.emit(schnellFundSender, "L2StandardBridgeSet")
                .withArgs(newBridgeAddress);
            expect(await schnellFundSender.l2StandardBridge()).to.equal(newBridgeAddress);
        });

        it("Non-owner should not be able to set L2 Standard Bridge address", async function () {
            const { schnellFundSender, otherAccount } = await loadFixture(deploySchnellFundSenderFixture);
            const newBridgeAddress = ethers.Wallet.createRandom().address;
            await expect(schnellFundSender.connect(otherAccount).setL2StandardBridge(newBridgeAddress))
                .to.be.revertedWithCustomError(schnellFundSender, "OwnableUnauthorizedAccount").withArgs(await otherAccount.getAddress());
        });

        it("Should not allow setting L2 Standard Bridge address to address(0)", async function () {
            const { schnellFundSender, owner } = await loadFixture(deploySchnellFundSenderFixture);
            await expect(schnellFundSender.connect(owner).setL2StandardBridge(ethers.ZeroAddress))
                .to.be.revertedWith("Bridge address cannot be zero");
        });
    });

    describe("Token Management", function () {
        it("Owner should be able to add a supported token", async function () {
            const { schnellFundSender, mockUsdc, owner } = await loadFixture(deploySchnellFundSenderFixture);
            const mockUsdcAddress = await mockUsdc.getAddress();
            await expect(schnellFundSender.connect(owner).addSupportedToken(mockUsdcAddress))
                .to.emit(schnellFundSender, "SupportedTokenAdded")
                .withArgs(mockUsdcAddress);
            expect(await schnellFundSender.supportedTokens(mockUsdcAddress)).to.be.true;
        });

        it("Non-owner should not be able to add a supported token", async function () {
            const { schnellFundSender, mockUsdc, otherAccount } = await loadFixture(deploySchnellFundSenderFixture);
            const mockUsdcAddress = await mockUsdc.getAddress();
            const otherAccountAddress = await otherAccount.getAddress();
            await expect(schnellFundSender.connect(otherAccount).addSupportedToken(mockUsdcAddress))
                .to.be.revertedWithCustomError(schnellFundSender, "OwnableUnauthorizedAccount").withArgs(otherAccountAddress);
        });

        it("Owner should be able to remove a supported token", async function () {
            const { schnellFundSender, mockUsdc, owner } = await loadFixture(deploySchnellFundSenderFixture);
            const mockUsdcAddress = await mockUsdc.getAddress();
            await schnellFundSender.connect(owner).addSupportedToken(mockUsdcAddress);
            await expect(schnellFundSender.connect(owner).removeSupportedToken(mockUsdcAddress))
                .to.emit(schnellFundSender, "SupportedTokenRemoved")
                .withArgs(mockUsdcAddress);
            expect(await schnellFundSender.supportedTokens(mockUsdcAddress)).to.be.false;
        });
    });

    describe("Sending Funds (L2)", function () {
        it("Should allow sending supported tokens after approval on L2", async function () {
            const { schnellFundSender, mockUsdc, owner, sender, recipient, initialSenderBalance } = await loadFixture(deploySchnellFundSenderFixture);
            const tokenAddress = await mockUsdc.getAddress();
            const schnellFundSenderAddress = await schnellFundSender.getAddress();
            const senderAddress = await sender.getAddress();
            const recipientAddress = await recipient.getAddress();
            const amountToSend = ethers.parseUnits("100", 6);

            await schnellFundSender.connect(owner).addSupportedToken(tokenAddress);
            await mockUsdc.connect(sender).approve(schnellFundSenderAddress, amountToSend);

            await expect(schnellFundSender.connect(sender).sendFunds(tokenAddress, amountToSend, recipientAddress))
                .to.emit(schnellFundSender, "FundsSent")
                .withArgs(senderAddress, recipientAddress, tokenAddress, amountToSend);

            expect(await mockUsdc.balanceOf(senderAddress)).to.equal(initialSenderBalance - amountToSend);
            expect(await mockUsdc.balanceOf(recipientAddress)).to.equal(amountToSend);
            expect(await mockUsdc.balanceOf(schnellFundSenderAddress)).to.equal(0n);
        });

        it("Should not allow sending unsupported tokens on L2", async function () {
            const { schnellFundSender, mockUsdc, sender, recipient } = await loadFixture(deploySchnellFundSenderFixture);
            const tokenAddress = await mockUsdc.getAddress();
            const schnellFundSenderAddress = await schnellFundSender.getAddress();
            const recipientAddress = await recipient.getAddress();
            const amountToSend = ethers.parseUnits("100", 6);
            await mockUsdc.connect(sender).approve(schnellFundSenderAddress, amountToSend);

            await expect(schnellFundSender.connect(sender).sendFunds(tokenAddress, amountToSend, recipientAddress))
                .to.be.revertedWith("Token not supported for L2 send");
        });

        it("Should not allow sending zero amount on L2", async function () {
            const { schnellFundSender, mockUsdc, owner, sender, recipient } = await loadFixture(deploySchnellFundSenderFixture);
            const tokenAddress = await mockUsdc.getAddress();
            const schnellFundSenderAddress = await schnellFundSender.getAddress();
            const recipientAddress = await recipient.getAddress();
            await schnellFundSender.connect(owner).addSupportedToken(tokenAddress);
            await mockUsdc.connect(sender).approve(schnellFundSenderAddress, ethers.parseUnits("1", 6));

            await expect(schnellFundSender.connect(sender).sendFunds(tokenAddress, 0n, recipientAddress))
                .to.be.revertedWith("Amount must be greater than zero");
        });

        it("Should fail if sender has not approved enough tokens for L2 send", async function () {
            const { schnellFundSender, mockUsdc, owner, sender, recipient } = await loadFixture(deploySchnellFundSenderFixture);
            const tokenAddress = await mockUsdc.getAddress();
            const schnellFundSenderAddress = await schnellFundSender.getAddress();
            const recipientAddress = await recipient.getAddress();
            const amountToSend = ethers.parseUnits("100", 6);
            await schnellFundSender.connect(owner).addSupportedToken(tokenAddress);
            await mockUsdc.connect(sender).approve(schnellFundSenderAddress, ethers.parseUnits("50", 6));

            await expect(schnellFundSender.connect(sender).sendFunds(tokenAddress, amountToSend, recipientAddress))
                .to.be.reverted; // ERC20InsufficientAllowance or similar
        });

        it("Should fail if sender has insufficient balance for L2 send (even if approved)", async function () {
            const { schnellFundSender, mockUsdc, owner, sender, recipient, otherAccount, initialSenderBalance } = await loadFixture(deploySchnellFundSenderFixture);
            const tokenAddress = await mockUsdc.getAddress();
            const schnellFundSenderAddress = await schnellFundSender.getAddress();
            const senderAddress = await sender.getAddress();
            const otherAccountAddress = await otherAccount.getAddress();
            const recipientAddress = await recipient.getAddress();

            await mockUsdc.connect(sender).transfer(otherAccountAddress, initialSenderBalance);
            expect(await mockUsdc.balanceOf(senderAddress)).to.equal(0n);

            const amountToSend = ethers.parseUnits("100", 6);
            await schnellFundSender.connect(owner).addSupportedToken(tokenAddress);
            await mockUsdc.connect(sender).approve(schnellFundSenderAddress, amountToSend);

            await expect(schnellFundSender.connect(sender).sendFunds(tokenAddress, amountToSend, recipientAddress))
                .to.be.reverted; // ERC20InsufficientBalance or similar
        });
    });

    describe("L1 Withdrawal Initiation", function () {
        it("Should allow sender to initiate withdrawal of supported tokens to L1", async function () {
            const { schnellFundSender, mockUsdc, mockL2Bridge, owner, sender, recipient, initialSenderBalance } = await loadFixture(deploySchnellFundSenderFixture);
            const l2TokenAddress = await mockUsdc.getAddress();
            const schnellFundSenderAddress = await schnellFundSender.getAddress();
            const l1RecipientAddress = await recipient.getAddress(); // Using recipient as L1 recipient for test
            const senderAddress = await sender.getAddress();
            const mockL2BridgeAddress = await mockL2Bridge.getAddress();

            const amountToWithdraw = ethers.parseUnits("200", 6);
            const minGasLimit = 200000;
            const extraData = "0x1234";

            // 1. Owner adds mUSDC as a supported token
            await schnellFundSender.connect(owner).addSupportedToken(l2TokenAddress);

            // 2. Sender approves SchnellFundSender contract to spend their mUSDC
            await mockUsdc.connect(sender).approve(schnellFundSenderAddress, amountToWithdraw);

            // 3. Sender initiates withdrawal
            // Check for the WithdrawalInitiatedOnL2 event from SchnellFundSender
            const tx = schnellFundSender.connect(sender).initiateWithdrawalToL1(l2TokenAddress, l1RecipientAddress, amountToWithdraw, minGasLimit, extraData);
            await expect(tx)
                .to.emit(schnellFundSender, "WithdrawalInitiatedOnL2")
                .withArgs(l2TokenAddress, l1RecipientAddress, senderAddress, amountToWithdraw, extraData);
        });

        it("Should correctly call bridge and emit event for L1 withdrawal", async function() {
            const { schnellFundSender, mockUsdc, mockL2Bridge, owner, sender, recipient, initialSenderBalance } = await loadFixture(deploySchnellFundSenderFixture);
            const l2TokenAddress = await mockUsdc.getAddress();
            const schnellFundSenderAddress = await schnellFundSender.getAddress();
            const l1RecipientAddress = await recipient.getAddress();
            const senderAddress = await sender.getAddress();
            const mockL2BridgeAddress = await mockL2Bridge.getAddress();

            const amountToWithdraw = ethers.parseUnits("150", 6);
            const minGasLimit = 250000;
            const extraData = "0xabcdef";

            await schnellFundSender.connect(owner).addSupportedToken(l2TokenAddress);
            await mockUsdc.connect(sender).approve(schnellFundSenderAddress, amountToWithdraw);

            // Perform the transaction that should also trigger the mock bridge event
            const tx = schnellFundSender.connect(sender).initiateWithdrawalToL1(l2TokenAddress, l1RecipientAddress, amountToWithdraw, minGasLimit, extraData);

            await expect(tx)
                .to.emit(schnellFundSender, "WithdrawalInitiatedOnL2")
                .withArgs(l2TokenAddress, l1RecipientAddress, senderAddress, amountToWithdraw, extraData);

            await expect(tx)
                .to.emit(mockL2Bridge, "WithdrawalCalled")
                .withArgs(l2TokenAddress, l1RecipientAddress, amountToWithdraw, minGasLimit, extraData);

            // Verify token balances
            expect(await mockUsdc.balanceOf(senderAddress)).to.equal(initialSenderBalance - amountToWithdraw);
            // SchnellFundSender should have approved, and MockL2Bridge should have pulled.
            expect(await mockUsdc.balanceOf(schnellFundSenderAddress)).to.equal(0n);
            // MockL2Bridge now holds the tokens in this mock setup
            expect(await mockUsdc.balanceOf(mockL2BridgeAddress)).to.equal(amountToWithdraw);
        });

        it("Should not allow L1 withdrawal for unsupported tokens", async function () {
            const { schnellFundSender, mockUsdc, sender, recipient } = await loadFixture(deploySchnellFundSenderFixture);
            const l2TokenAddress = await mockUsdc.getAddress();
            const schnellFundSenderAddress = await schnellFundSender.getAddress();
            const l1RecipientAddress = await recipient.getAddress();
            const amountToWithdraw = ethers.parseUnits("100", 6);
            await mockUsdc.connect(sender).approve(schnellFundSenderAddress, amountToWithdraw);

            await expect(schnellFundSender.connect(sender).initiateWithdrawalToL1(l2TokenAddress, l1RecipientAddress, amountToWithdraw, 200000, "0x"))
                .to.be.revertedWith("Token not supported for L1 withdrawal");
        });

        // Add more failure cases: zero amount, sender no approval, sender insufficient balance specifically for withdrawal
         it("Should not allow L1 withdrawal of zero amount", async function () {
            const { schnellFundSender, mockUsdc, owner, sender, recipient } = await loadFixture(deploySchnellFundSenderFixture);
            const l2TokenAddress = await mockUsdc.getAddress();
            await schnellFundSender.connect(owner).addSupportedToken(l2TokenAddress);
            // No approval needed if amount is 0, but our check is before approval step
            await expect(schnellFundSender.connect(sender).initiateWithdrawalToL1(l2TokenAddress, await recipient.getAddress(), 0, 200000, "0x"))
                .to.be.revertedWith("Amount must be greater than zero");
        });
    });

    describe("Withdrawals (Owner)", function () {
        it("Owner should be able to withdraw accidentally sent ERC20 tokens", async function () {
            const { schnellFundSender, mockUsdc, owner } = await loadFixture(deploySchnellFundSenderFixture);
            const tokenAddress = await mockUsdc.getAddress();
            const contractAddress = await schnellFundSender.getAddress();
            const ownerAddress = await owner.getAddress();

            const accidentAmount = ethers.parseUnits("50", 6);
            await mockUsdc.connect(owner).mint(ownerAddress, accidentAmount);
            await mockUsdc.connect(owner).transfer(contractAddress, accidentAmount);
            expect(await mockUsdc.balanceOf(contractAddress)).to.equal(accidentAmount);

            const ownerInitialBalance = await mockUsdc.balanceOf(ownerAddress);
            await schnellFundSender.connect(owner).withdrawERC20(tokenAddress, ownerAddress, accidentAmount);

            expect(await mockUsdc.balanceOf(contractAddress)).to.equal(0n);
            expect(await mockUsdc.balanceOf(ownerAddress)).to.equal(ownerInitialBalance + accidentAmount);
        });

        it("Owner should be able to withdraw accidentally sent Ether", async function () {
            const { schnellFundSender, owner } = await loadFixture(deploySchnellFundSenderFixture);
            const contractAddress = await schnellFundSender.getAddress();
            const ownerAddress = await owner.getAddress();
            const amountToSend = ethers.parseEther("1.0");

            // Ensure owner has ETH to send by direct transaction
            // Send Ether to the contract
            const txEthSend = await owner.sendTransaction({ to: contractAddress, value: amountToSend });
            await txEthSend.wait();
            expect(await ethers.provider.getBalance(contractAddress)).to.equal(amountToSend);

            const ownerInitialEthBalance = await ethers.provider.getBalance(ownerAddress);

            const txWithdraw = await schnellFundSender.connect(owner).withdrawEther(ownerAddress);
            const receipt: TransactionReceipt | null = await txWithdraw.wait();

            if (!receipt) throw new Error("Transaction receipt is null");
            const gasUsed = receipt.gasUsed;
            const pricePaidPerGas = receipt.gasPrice;
            if (pricePaidPerGas === null || pricePaidPerGas === undefined) {
                throw new Error("Could not determine gas price from transaction receipt");
            }
            const txCost = gasUsed * pricePaidPerGas;

            expect(await ethers.provider.getBalance(contractAddress)).to.equal(0n);
            expect(await ethers.provider.getBalance(ownerAddress)).to.equal(BigInt(ownerInitialEthBalance) + BigInt(amountToSend) - BigInt(txCost));
        });
    });
});
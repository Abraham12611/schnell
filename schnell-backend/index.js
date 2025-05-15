require('dotenv').config(); // Load environment variables
const express = require('express');
const { ethers } = require('ethers');
const sqlite3 = require('sqlite3').verbose(); // Use verbose for more detailed stack traces

const app = express();
const port = process.env.PORT || 3001; // Backend server port

// Mantle Sepolia Testnet RPC URL
const MANTLE_SEPOLIA_RPC_URL = 'https://rpc.sepolia.mantle.xyz';

// ABI for SchnellFundSender contract
// Extracted from schnell-protocol/artifacts/contracts/SchnellFundSender.sol/SchnellFundSender.json
const SCHNELL_FUND_SENDER_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_initialL2StandardBridgeAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "SafeERC20FailedOperation",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "FundsSent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "l2Token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "l1Token",
          "type": "address"
        }
      ],
      "name": "L1TokenCounterpartSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "bridgeAddress",
          "type": "address"
        }
      ],
      "name": "L2StandardBridgeSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "SupportedTokenAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "SupportedTokenRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "l2Token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "l1Recipient",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "l2Sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "l1Token",
          "type": "bytes"
        }
      ],
      "name": "WithdrawalInitiatedOnL2",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "addSupportedToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_l2Token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_l1Recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint32",
          "name": "_minGasLimit",
          "type": "uint32"
        },
        {
          "internalType": "bytes",
          "name": "_extraData",
          "type": "bytes"
        }
      ],
      "name": "initiateWithdrawalToL1",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "l1TokenCounterpart",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "l2StandardBridge",
      "outputs": [
        {
          "internalType": "contract IL2StandardBridge",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "removeSupportedToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "sendFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_l1TokenCounterpart",
          "type": "address"
        }
      ],
      "name": "setL1TokenCounterpart",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_l2StandardBridgeAddress",
          "type": "address"
        }
      ],
      "name": "setL2StandardBridge",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "supportedTokens",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "withdrawAccidentalERC20",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawAccidentalEth",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
]; // Shortened for brevity, full ABI is in SchnellFundSender.json

// !!! IMPORTANT: Replace with your deployed SchnellFundSender contract address on Mantle Sepolia !!!
const SCHNELL_FUND_SENDER_CONTRACT_ADDRESS = process.env.SCHNELL_FUND_SENDER_CONTRACT_ADDRESS || '0x37E7E8D2a190c5250732cB63eBACb40540258deb';
const BACKEND_WALLET_PRIVATE_KEY = process.env.BACKEND_WALLET_PRIVATE_KEY;

// Pyth Network Contract Details
const PYTH_CONTRACT_ADDRESS_MANTLE_SEPOLIA = '0x197E3A1b174F5B9C071361E9C9C1aA8A4d2bB103';
const PYTH_ABI = [
    {
        "inputs": [{ "internalType": "bytes32", "name": "id", "type": "bytes32" }],
        "name": "getPriceUnsafe",
        "outputs": [
            {
                "components": [
                    { "internalType": "int64", "name": "price", "type": "int64" },
                    { "internalType": "uint64", "name": "conf", "type": "uint64" },
                    { "internalType": "int32", "name": "expo", "type": "int32" },
                    { "internalType": "uint256", "name": "publishTime", "type": "uint256" }
                ],
                "internalType": "struct PythStructs.Price",
                "name": "price",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Known Price Feed IDs for Mantle Sepolia Testnet
const PYTH_PRICE_FEED_IDS = {
    "MNT-USD": "0x60B4C8B0D119094AD034E2429F134C0D60B543E9F543694F2BBEB42939991E1B",
    "USDC-USD": "0x05ED97A984476E3604DBA087E0CA0953D5A67008F1A50E390C0F054C788AB5C7",
    "ETH-USD": "0x58161121F452087E448B57990322A85C9A79F94A9D95811FB1D55A86A4820F33",
    "BTC-USD": "0x4201C5735B63A578897A361B607C886108593C3404A09CE94512A1608A7A9402"
};

// Database setup
const DB_FILE = './schnell_data.db';
const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error(`Error opening database ${DB_FILE}:`, err.message);
    } else {
        console.log(`Successfully connected to SQLite database: ${DB_FILE}`);
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tx_hash TEXT UNIQUE NOT NULL,
            event_type TEXT NOT NULL,
            sender TEXT,
            recipient TEXT,
            token_address TEXT,
            amount TEXT,
            l1_recipient TEXT,
            l2_sender TEXT,
            l1_token_bytes TEXT,
            block_number INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error("Error creating transactions table:", err.message);
            } else {
                console.log("Transactions table checked/created successfully.");
            }
        });
    }
});

let provider;
let signer;
let schnellContract_ReadOnly;
let schnellContract_Writable;
let pythContract_ReadOnly;

try {
    provider = new ethers.JsonRpcProvider(MANTLE_SEPOLIA_RPC_URL);
    console.log('Successfully connected to Mantle Sepolia Testnet as a provider.');

    if (!BACKEND_WALLET_PRIVATE_KEY || BACKEND_WALLET_PRIVATE_KEY === '0xyour_backend_wallet_private_key_here') {
        console.warn('Backend wallet private key is not set or is a placeholder. Transaction sending will not be available.');
    } else {
        signer = new ethers.Wallet(BACKEND_WALLET_PRIVATE_KEY, provider);
        console.log(`Backend signer initialized with address: ${signer.address}`);
    }

    provider.getBlockNumber().then(blockNumber => {
        console.log(`Current block number on Mantle Sepolia: ${blockNumber}`);
    }).catch(error => {
        console.error(`Error fetching block number: ${error.message}`);
    });

    if (SCHNELL_FUND_SENDER_CONTRACT_ADDRESS && SCHNELL_FUND_SENDER_CONTRACT_ADDRESS !== '0xYOUR_CONTRACT_ADDRESS_HERE') {
        schnellContract_ReadOnly = new ethers.Contract(
            SCHNELL_FUND_SENDER_CONTRACT_ADDRESS,
            SCHNELL_FUND_SENDER_ABI,
            provider
        );
        console.log(`Read-only contract instance created for ${SCHNELL_FUND_SENDER_CONTRACT_ADDRESS}`);

        if (signer) {
            schnellContract_Writable = new ethers.Contract(
                SCHNELL_FUND_SENDER_CONTRACT_ADDRESS,
                SCHNELL_FUND_SENDER_ABI,
                signer
            );
            console.log(`Writable contract instance created for ${SCHNELL_FUND_SENDER_CONTRACT_ADDRESS}`);
        }

        console.log(`Listening for events from SchnellFundSender contract at ${SCHNELL_FUND_SENDER_CONTRACT_ADDRESS}`);
        schnellContract_ReadOnly.on('FundsSent', (sender, recipient, token, amount, event) => {
            console.log('\n---------- FundsSent Event Received ----------');
            console.log(`  Sender: ${sender}`);
            console.log(`  Recipient: ${recipient}`);
            console.log(`  Token: ${token}`);
            console.log(`  Amount: ${ethers.formatUnits(amount, 18)} (raw: ${amount.toString()})`); // Assuming 18 decimals
            console.log(`  Tx Hash: ${event.log.transactionHash}`);
            console.log(`  Block: ${event.log.blockNumber}`);
            console.log('---------------------------------------------\n');
            const txHash = event.log.transactionHash;
            const blockNumber = event.log.blockNumber;
            db.run(`INSERT INTO transactions (tx_hash, event_type, sender, recipient, token_address, amount, block_number)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [txHash, 'FundsSent', sender, recipient, token, amount.toString(), blockNumber],
                    function(err) {
                        if (err) {
                            return console.error("Error inserting FundsSent event into DB:", err.message);
                        }
                        console.log(`FundsSent event (tx: ${txHash}) logged to DB with rowid ${this.lastID}`);
                    }
            );
        });

        schnellContract_ReadOnly.on('WithdrawalInitiatedOnL2', (l2Token, l1Recipient, l2Sender, amount, l1TokenBytes, event) => {
            console.log('\n---------- WithdrawalInitiatedOnL2 Event Received ----------');
            console.log(`  L2 Token: ${l2Token}`);
            console.log(`  L1 Recipient: ${l1Recipient}`);
            console.log(`  L2 Sender: ${l2Sender}`);
            console.log(`  Amount: ${ethers.formatUnits(amount, 18)} (raw: ${amount.toString()})`); // Assuming 18 decimals
            console.log(`  L1 Token (bytes): ${l1TokenBytes}`);
            console.log(`  Tx Hash: ${event.log.transactionHash}`);
            console.log(`  Block: ${event.log.blockNumber}`);
            console.log('-----------------------------------------------------------\n');
            const txHash = event.log.transactionHash;
            const blockNumber = event.log.blockNumber;
            db.run(`INSERT INTO transactions (tx_hash, event_type, token_address, l1_recipient, l2_sender, amount, l1_token_bytes, block_number)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [txHash, 'WithdrawalInitiatedOnL2', l2Token, l1Recipient, l2Sender, amount.toString(), l1TokenBytes, blockNumber],
                    function(err) {
                        if (err) {
                            return console.error("Error inserting WithdrawalInitiatedOnL2 event into DB:", err.message);
                        }
                        console.log(`WithdrawalInitiatedOnL2 event (tx: ${txHash}) logged to DB with rowid ${this.lastID}`);
                    }
            );
        });

        schnellContract_ReadOnly.on('error', (error) => {
            console.error(`Error in contract event listener: ${error.message}`);
        });

    } else {
        console.warn('SchnellFundSender contract address is not set or is a placeholder. Contract interactions and event listening will not be initialized.');
    }

    // Initialize Pyth contract (read-only)
    pythContract_ReadOnly = new ethers.Contract(PYTH_CONTRACT_ADDRESS_MANTLE_SEPOLIA, PYTH_ABI, provider);
    console.log(`Read-only Pyth Price Feed contract instance created at ${PYTH_CONTRACT_ADDRESS_MANTLE_SEPOLIA}`);

} catch (error) {
    console.error(`Failed to initialize backend: ${error.message}`);
}

app.use(express.json()); // Middleware to parse JSON bodies

// Simple root endpoint
app.get('/', (req, res) => {
    res.send('Schnell Backend is running!');
});

// Example endpoint to get the latest block number
app.get('/latest-block', async (req, res) => {
    if (!provider) {
        return res.status(503).json({ error: 'Mantle provider not available.' });
    }
    try {
        const blockNumber = await provider.getBlockNumber();
        res.json({ latestBlockNumber: blockNumber.toString() });
    } catch (error) {
        console.error('Error fetching latest block:', error);
        res.status(500).json({ error: 'Failed to fetch latest block number.', details: error.message });
    }
});

// Endpoint to send funds on L2
app.post('/api/send-funds', async (req, res) => {
    if (!schnellContract_Writable) {
        return res.status(503).json({ error: 'Contract not initialized or signer not available.' });
    }

    const { token, recipient, amountString } = req.body;

    if (!token || !recipient || !amountString) {
        return res.status(400).json({ error: 'Missing required fields: token, recipient, amountString.' });
    }
    if (!ethers.isAddress(token) || !ethers.isAddress(recipient)) {
        return res.status(400).json({ error: 'Invalid Ethereum address provided for token or recipient.' });
    }

    try {
        const amount = ethers.parseUnits(amountString, 18); // Assuming 18 decimals for the token
        console.log(`Attempting to send ${amountString} of token ${token} to ${recipient}`);

        const tx = await schnellContract_Writable.sendFunds(token, recipient, amount);
        console.log(`sendFunds transaction sent: ${tx.hash}`);
        await tx.wait(); // Wait for transaction to be mined
        console.log(`sendFunds transaction mined: ${tx.hash}`);

        res.json({ message: 'Funds sent successfully', transactionHash: tx.hash });
    } catch (error) {
        console.error('Error in /api/send-funds:', error);
        res.status(500).json({ error: 'Failed to send funds.', details: error.message });
    }
});

// Endpoint to initiate withdrawal to L1
app.post('/api/initiate-withdrawal', async (req, res) => {
    if (!schnellContract_Writable) {
        return res.status(503).json({ error: 'Contract not initialized or signer not available.' });
    }

    const { l2Token, l1Recipient, amountString, minGasLimit, extraData = '0x' } = req.body;

    if (!l2Token || !l1Recipient || !amountString || minGasLimit === undefined) {
        return res.status(400).json({ error: 'Missing required fields: l2Token, l1Recipient, amountString, minGasLimit.' });
    }
    if (!ethers.isAddress(l2Token) || !ethers.isAddress(l1Recipient)) {
        return res.status(400).json({ error: 'Invalid Ethereum address provided for l2Token or l1Recipient.' });
    }
    if (typeof minGasLimit !== 'number' || minGasLimit <= 0) {
        return res.status(400).json({ error: 'minGasLimit must be a positive number.' });
    }
    if (!ethers.isHexString(extraData)) {
        return res.status(400).json({ error: 'extraData must be a valid hex string (e.g., 0x...)'});
    }

    try {
        const amount = ethers.parseUnits(amountString, 18); // Assuming 18 decimals for the token
        console.log(`Attempting to initiate withdrawal of ${amountString} ${l2Token} to L1 recipient ${l1Recipient}`);

        const tx = await schnellContract_Writable.initiateWithdrawalToL1(
            l2Token,
            l1Recipient,
            amount,
            minGasLimit,
            extraData
        );
        console.log(`initiateWithdrawalToL1 transaction sent: ${tx.hash}`);
        await tx.wait(); // Wait for transaction to be mined
        console.log(`initiateWithdrawalToL1 transaction mined: ${tx.hash}`);

        res.json({ message: 'Withdrawal initiated successfully', transactionHash: tx.hash });
    } catch (error) {
        console.error('Error in /api/initiate-withdrawal:', error);
        res.status(500).json({ error: 'Failed to initiate withdrawal.', details: error.message });
    }
});

// Endpoint to get price feed from Pyth
app.get('/api/price-feed/:assetPair', async (req, res) => {
    const assetPair = req.params.assetPair.toUpperCase();
    const feedId = PYTH_PRICE_FEED_IDS[assetPair];

    if (!pythContract_ReadOnly) {
        return res.status(503).json({ error: 'Pyth contract not initialized.' });
    }
    if (!feedId) {
        return res.status(404).json({ error: `Price feed ID not found for asset pair: ${assetPair}. Supported pairs: ${Object.keys(PYTH_PRICE_FEED_IDS).join(', ')}` });
    }

    try {
        console.log(`Fetching price for ${assetPair} (Feed ID: ${feedId}) from Pyth...`);
        const priceData = await pythContract_ReadOnly.getPriceUnsafe(feedId);

        // The price is returned as a BigInt with a number of decimals (expo).
        // price_value = price * (10^expo)
        // So, actual_price = price / (10^(-expo))
        const price = Number(priceData.price);
        const conf = Number(priceData.conf);
        const expo = Number(priceData.expo);
        const publishTime = Number(priceData.publishTime);

        const actualPrice = price * (10 ** expo); // Note: expo is typically negative
        const confidenceInterval = conf * (10 ** expo);

        res.json({
            assetPair,
            feedId,
            price: actualPrice,
            confidence: confidenceInterval,
            expo,
            publishTime: new Date(publishTime * 1000).toISOString(), // Convert Unix timestamp to ISO string
            raw: {
                price: priceData.price.toString(),
                conf: priceData.conf.toString(),
                expo: expo,
                publishTime: publishTime.toString()
            }
        });
    } catch (error) {
        console.error(`Error fetching price for ${assetPair} from Pyth:`, error);
        res.status(500).json({ error: `Failed to fetch price for ${assetPair}.`, details: error.message });
    }
});

// Endpoint to get logged transactions
app.get('/api/transactions', (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    db.all(`SELECT * FROM transactions ORDER BY timestamp DESC LIMIT ? OFFSET ?`, [limit, offset], (err, rows) => {
        if (err) {
            console.error("Error querying transactions from DB:", err.message);
            return res.status(500).json({ error: "Failed to retrieve transactions.", details: err.message });
        }
        db.get("SELECT COUNT(*) as count FROM transactions", (err, total) => {
            if (err) {
                console.error("Error counting transactions from DB:", err.message);
                return res.status(500).json({ error: "Failed to count transactions.", details: err.message });
            }
            res.json({
                data: rows,
                total: total.count,
                limit,
                offset
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Schnell backend server listening at http://localhost:${port}`);
});

// Export the provider for potential use in other modules
module.exports = { app, provider, signer, db };
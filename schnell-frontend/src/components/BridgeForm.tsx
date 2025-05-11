'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSimulateContract } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { ethers } from 'ethers'; // For parseUnits

// --- Schnell Contract Details ---
const SCHNELL_FUND_SENDER_CONTRACT_ADDRESS = '0x37E7E8D2a190c5250732cB63eBACb40540258deb'; // Using the one from backend .env
const SCHNELL_FUND_SENDER_ABI = [
    // Copied from schnell-backend/index.js (ensure this is kept in sync or managed centrally)
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
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_recipient",
          "type": "address"
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
];
// --- End Schnell Contract Details ---


const BridgeForm = () => {
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState('');
  const [fromChain, setFromChain] = useState('Mantle Sepolia'); // Hardcoded for now
  const [toChain, setToChain] = useState('Mantle Sepolia'); // Hardcoded for now
  const [transactionStatus, setTransactionStatus] = useState('');
  const [txError, setTxError] = useState<string | null>(null);

  const { address, isConnected, chainId } = useAccount();
  const { open } = useAppKit();

  const { data: hash, isPending: isWritePending, writeContract, error: writeContractError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmationError } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (writeContractError) {
      setTxError(writeContractError.message);
      setTransactionStatus('Error preparing transaction.');
      console.error("Contract write error:", writeContractError);
    }
    if (confirmationError) {
      setTxError(confirmationError.message);
      setTransactionStatus('Error confirming transaction.');
      console.error("Confirmation error:", confirmationError);
    }
  }, [writeContractError, confirmationError]);


  const tokens = [
    { symbol: 'USDC', name: 'USD Coin', address: '0x2685dBDAa8B77f8279338DcE19F238EaD3Bf008E', icon: '/usd-coin-usdc-logo.svg', decimals: 6 }, // USDC usually has 6 decimals
    { symbol: 'USDT', name: 'Tether', address: '0xA17223421f993F788Dbc3F0BA79CC4443245740E', icon: '/tether-usdt-logo.svg', decimals: 6 }, // USDT usually has 6 decimals
    { symbol: 'WMNT', name: 'Wrapped Mantle', address: '0xc0eeCFA24E391E4259B7EF17be54Be5139DA1AC7', icon: '/mantle-mnt-logo.svg', decimals: 18 },
  ];

  const chains = [
    { id: '5003', name: 'Mantle Sepolia', icon: '/mantle-mnt-logo.svg' },
  ];

  const selectedTokenDetails = tokens.find(t => t.symbol === selectedTokenSymbol);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransactionStatus('');
    setTxError(null);

    if (!isConnected || !address) {
      open();
      return;
    }
    if (chainId !== 5003) {
      alert('Please switch to the Mantle Sepolia network.');
      // Consider using Reown AppKit's network switching: open({ view: 'Networks' });
      return;
    }
    if (!selectedTokenDetails || !recipientAddress || !amount) {
      alert('Please fill in all fields.');
      return;
    }
    if (!ethers.isAddress(recipientAddress)) {
        alert('Invalid recipient address.');
        setTxError('Invalid recipient address.');
        return;
    }

    try {
      const amountParsed = ethers.parseUnits(amount, selectedTokenDetails.decimals);
      setTransactionStatus('Preparing transaction...');

      // contract call (optional but good practice for UX and error checking)
      // const { request } = await simulateContract({ // Part of wagmi
      //   address: SCHNELL_FUND_SENDER_CONTRACT_ADDRESS,
      //   abi: SCHNELL_FUND_SENDER_ABI,
      //   functionName: 'sendFunds',
      //   args: [selectedTokenDetails.address, recipientAddress, amountParsed],
      //   // chainId: 5003 // Ensure this is correctly picked up or set
      // });
      // console.log("Simulated request:", request);


      // Call the contract
      setTransactionStatus('Sending transaction...');
      writeContract({
        address: SCHNELL_FUND_SENDER_CONTRACT_ADDRESS,
        abi: SCHNELL_FUND_SENDER_ABI,
        functionName: 'sendFunds',
        args: [selectedTokenDetails.address, amountParsed, recipientAddress],
        // chainId: 5003 - wagmi should infer this from the connected wallet
      });

    } catch (error: any) {
      console.error('Error submitting transaction:', error);
      setTransactionStatus('Transaction failed.');
      setTxError(error.message || 'An unknown error occurred.');
      alert(`Error: ${error.message || 'Failed to send transaction.'}`);
    }
  };

  useEffect(() => {
    if (isConfirming) {
      setTransactionStatus(`Processing transaction: ${hash?.substring(0,10)}...`);
    }
    if (isConfirmed) {
      setTransactionStatus(`Transaction Confirmed: ${hash}`);
      // Reset form or provide further user feedback
      setAmount('');
      setRecipientAddress('');
      setSelectedTokenSymbol('');
      // alert('Transaction successful!'); // Consider using a toast notification
    }
  }, [isConfirming, isConfirmed, hash]);


  const handleConnectWallet = () => {
    open();
  };

  const isOnCorrectNetwork = chainId === 5003;
  // Updated canSubmit to reflect selectedTokenSymbol and selectedTokenDetails
  const canSubmit = amount && recipientAddress && selectedTokenSymbol && isConnected && isOnCorrectNetwork && !!selectedTokenDetails;
  let buttonText = 'Connect Wallet';
  // Action for the button
  let buttonAction: (() => void) | ((e: React.FormEvent) => Promise<void>) = handleConnectWallet;


  if (isConnected) {
    if (!isOnCorrectNetwork) {
      buttonText = 'Switch to Mantle Sepolia';
      buttonAction = () => open({ view: 'Networks' });
    } else if (isWritePending || isConfirming) {
      buttonText = isConfirming ? 'Processing...' : 'Sending...';
      // Disable button action during processing
    } else if (!amount || !recipientAddress || !selectedTokenSymbol || !selectedTokenDetails) {
      buttonText = 'Enter Details';
      buttonAction = handleSubmit; // Allow submit to trigger validation messages
    } else {
      buttonText = 'Send Funds';
      buttonAction = handleSubmit;
    }
  }


  return (
    <div className="bg-brand-charcoal-light p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md border border-brand-charcoal-lighter">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-semibold text-brand-teal mb-1">
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="amount"
              id="amount"
              className="focus:ring-brand-teal focus:border-brand-teal block w-full sm:text-sm border-brand-charcoal-lighter rounded-md bg-brand-charcoal-darkest p-3 text-brand-teal placeholder-gray-500"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-describedby="amount-currency"
              disabled={isWritePending || isConfirming}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-brand-teal sm:text-sm" id="amount-currency">
                {selectedTokenSymbol || 'TOKEN'}
              </span>
            </div>
          </div>
        </div>

        {/* Token Selector */}
        <div>
          <label htmlFor="token" className="block text-sm font-semibold text-brand-teal mb-1">
            Token
          </label>
          <select
            id="token"
            name="token"
            value={selectedTokenSymbol}
            onChange={(e) => setSelectedTokenSymbol(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-brand-charcoal-lighter focus:outline-none focus:ring-brand-teal focus:border-brand-teal sm:text-sm rounded-md bg-brand-charcoal-darkest text-brand-teal"
            disabled={isWritePending || isConfirming}
          >
            <option value="" disabled className="text-brand-teal bg-brand-charcoal-darkest">Select Token</option>
            {tokens.map((token) => (
              <option key={token.symbol} value={token.symbol} className="text-brand-teal bg-brand-charcoal-darkest">
                <img src={token.icon} alt={token.name} className="w-5 h-5 mr-2 inline-block align-middle" />
                <span className="ml-2 align-middle">{token.name} ({token.symbol}) - {token.decimals} decimals</span>
              </option>
            ))}
          </select>
        </div>

        {/* Recipient Address Input */}
        <div>
          <label htmlFor="recipientAddress" className="block text-sm font-semibold text-brand-teal mb-1">
            Recipient Address (on {toChain})
          </label>
          <input
            type="text"
            name="recipientAddress"
            id="recipientAddress"
            className="focus:ring-brand-teal focus:border-brand-teal block w-full sm:text-sm border-brand-charcoal-lighter rounded-md bg-brand-charcoal-darkest p-3 text-brand-teal placeholder-gray-500"
            placeholder="0x..."
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            disabled={isWritePending || isConfirming}
          />
        </div>

        {/* From Chain Display */}
        <div>
          <label htmlFor="fromChain" className="block text-sm font-semibold text-brand-teal mb-1">
            From Chain
          </label>
          <input
            type="text"
            name="fromChain"
            id="fromChain"
            value={fromChain}
            readOnly
            className="mt-1 block w-full sm:text-sm border-brand-charcoal-lighter rounded-md bg-brand-charcoal-dark p-3 text-brand-teal cursor-not-allowed"
          />
        </div>

        {/* To Chain Display */}
        <div>
          <label htmlFor="toChain" className="block text-sm font-semibold text-brand-teal mb-1">
            To Chain
          </label>
          <input
            type="text"
            name="toChain"
            id="toChain"
            value={toChain}
            readOnly
            className="mt-1 block w-full sm:text-sm border-brand-charcoal-lighter rounded-md bg-brand-charcoal-dark p-3 text-brand-teal cursor-not-allowed"
          />
        </div>

        {/* Fee and ETA Display */}
        <div className="bg-brand-charcoal-dark p-4 rounded-md border border-brand-charcoal-lighter space-y-2">
          <h3 className="text-sm font-semibold text-brand-teal mb-2">Transaction Estimates</h3>
          <div className="flex justify-between text-xs text-brand-teal">
            <span>Estimated Network Fee:</span>
            <span>TBD MNT</span>
          </div>
          <div className="flex justify-between text-xs text-brand-teal">
            <span>Estimated Bridge Time:</span>
            <span>~ Instant (on Mantle L2)</span>
          </div>
        </div>

        {/* Transaction Status Display */}
        {(transactionStatus || txError) && (
          <div className={`p-3 rounded-md text-sm ${txError ? 'bg-red-900 border-red-700' : 'bg-blue-900 border-blue-700'} border`}>
            <p className="font-medium text-brand-teal">
              {transactionStatus}
            </p>
            {txError && <p className="text-red-200 mt-1 text-xs break-all">Details: {txError}</p>}
            {hash && !isConfirmed && (
                <p className="mt-1 text-xs">
                    <a
                        href={`https://explorer.sepolia.mantle.xyz/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-teal hover:text-brand-teal-light underline"
                    >
                        View on Mantle Explorer
                    </a>
                </p>
            )}
          </div>
        )}


        {/* Action Button */}
        <div>
          <button
            type="button" // Changed from submit to control via onClick
            onClick={(e) => {
              if (buttonAction === handleSubmit) {
                handleSubmit(e);
              } else {
                (buttonAction as () => void)(); // Explicitly cast for functions without args
              }
            }}
            disabled={
              (isConnected && isOnCorrectNetwork && !canSubmit && !(isWritePending || isConfirming) ) || // Form incomplete
              isWritePending || isConfirming // Transaction in progress
            }
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                        ${ (isWritePending || isConfirming) ? 'bg-gray-500 cursor-not-allowed'
                          : (isConnected && isOnCorrectNetwork && canSubmit) ? 'bg-brand-teal hover:bg-brand-teal-dark focus:ring-brand-teal-darker'
                          : (isConnected && !isOnCorrectNetwork) ? 'bg-orange-500 hover:bg-orange-600'
                          : 'bg-blue-600 hover:bg-blue-700'
                        }
                        ${ (isConnected && isOnCorrectNetwork && !canSubmit && !(isWritePending || isConfirming)) ? 'opacity-50 cursor-not-allowed' : ''}
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-charcoal`}
          >
            {buttonText}
          </button>
        </div>
      </form>

      {/* Mantle Gas Tagline Placeholder */}
      <div className="mt-6 text-xs text-center text-brand-teal">
        <p>~0.02 gwei base fee on Mantle (placeholder)</p>
        <p>Live Base Fee: TBD gwei | Block Time: TBD s (placeholder)</p>
        {address && <p className="mt-2">Connected: {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`} (Chain ID: {chainId})</p>}
      </div>
    </div>
  );
};

export default BridgeForm;
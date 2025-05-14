// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Interface for the L2 Standard Bridge
interface IL2StandardBridge {
    function withdrawTo(
        address _l2Token,
        address _to, // Recipient on L1
        uint256 _amount,
        uint32 _minGasLimit, // Gas limit for L1 execution
        bytes calldata _extraData
    ) external;

    function messenger() external view returns (address);
}

contract SchnellFundSender is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IL2StandardBridge public l2StandardBridge;
    address public l1TokenCounterpart; // Example: L1 address of USDC if _l2Token is Mantle USDC

    mapping(address => bool) public supportedTokens; // ERC20 token addresses on Mantle

    event FundsSent(
        address indexed sender,
        address indexed recipient,
        address indexed token,
        uint256 amount
    );

    event WithdrawalInitiatedOnL2(
        address indexed l2Token,
        address indexed l1Recipient,
        address indexed l2Sender,
        uint256 amount,
        bytes l1Token // Storing L1 token address in bytes to be flexible, or could be address if always same type
    );

    event SupportedTokenAdded(address indexed token);
    event SupportedTokenRemoved(address indexed token);
    event L2StandardBridgeSet(address indexed bridgeAddress);
    event L1TokenCounterpartSet(address indexed l2Token, address indexed l1Token);

    constructor(address _initialL2StandardBridgeAddress) Ownable(msg.sender) {
        require(_initialL2StandardBridgeAddress != address(0), "Bridge address cannot be zero");
        l2StandardBridge = IL2StandardBridge(_initialL2StandardBridgeAddress);
        emit L2StandardBridgeSet(_initialL2StandardBridgeAddress);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    function setL2StandardBridge(address _bridgeAddress) public onlyOwner {
        require(_bridgeAddress != address(0), "Bridge address cannot be zero");
        l2StandardBridge = IL2StandardBridge(_bridgeAddress);
        emit L2StandardBridgeSet(_bridgeAddress);
    }

    // Placeholder for mapping L2 tokens to their L1 counterparts if needed by the bridge or frontend
    // For simplicity, we might assume direct mapping or handle this off-chain initially.
    // For now, we can add a simple setter if we need to store this on-chain for some reason.
    // This is highly dependent on how the specific L1StandardBridge resolves l2Token to l1Token.
    // Often, the L2 token IS the l1Token representation or the bridge handles mapping.
    // Let's assume for now the _l2Token address is what the L2 bridge expects.

    function addSupportedToken(address _token) public onlyOwner {
        require(_token != address(0), "Token cannot be zero address");
        supportedTokens[_token] = true;
        emit SupportedTokenAdded(_token);
    }

    function removeSupportedToken(address _token) public onlyOwner {
        supportedTokens[_token] = false;
        emit SupportedTokenRemoved(_token);
    }

    /**
     * @notice Allows a user to send a supported ERC20 token to a recipient on L2.
     */
    function sendFunds(
        address _token,
        uint256 _amount,
        address _recipient
    ) public nonReentrant {
        require(supportedTokens[_token], "Token not supported for L2 send");
        require(_recipient != address(0), "Recipient cannot be zero address");
        require(_amount > 0, "Amount must be greater than zero");

        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        IERC20(_token).safeTransfer(_recipient, _amount);

        emit FundsSent(msg.sender, _recipient, _token, _amount);
    }

    /**
     * @notice Initiates a withdrawal of an L2 ERC20 token to an L1 recipient via the Standard Bridge.
     * @dev User must approve this contract to spend `_amount` of `_l2Token`.
     * @param _l2Token The address of the ERC20 token on L2 to withdraw.
     * @param _l1Recipient The address that will receive the tokens on L1.
     * @param _amount The amount of tokens to withdraw.
     * @param _minGasLimit Minimum gas to be relayed to L1 for processing the message.
     * @param _extraData Optional data to be passed to L1 along with the withdrawal.
     */
    function initiateWithdrawalToL1(
        address _l2Token,
        address _l1Recipient,
        uint256 _amount,
        uint32 _minGasLimit,
        bytes calldata _extraData
    ) public nonReentrant {
        require(supportedTokens[_l2Token], "Token not supported for L1 withdrawal"); // Ensure token is generally supported
        require(_l1Recipient != address(0), "L1 recipient cannot be zero address");
        require(_amount > 0, "Amount must be greater than zero");

        // 1. Transfer tokens from the sender to this contract
        IERC20(_l2Token).safeTransferFrom(msg.sender, address(this), _amount);

        // 2. Approve the L2StandardBridge to spend these tokens from this contract
        IERC20(_l2Token).approve(address(l2StandardBridge), _amount);

        // 3. Call withdrawTo on the L2StandardBridge
        l2StandardBridge.withdrawTo(
            _l2Token,
            _l1Recipient,
            _amount,
            _minGasLimit,
            _extraData
        );

        // Emit an event (Consider what information is most useful for off-chain monitoring)
        // For now, we'll include the L1 token address as part of _extraData or assume a mapping.
        // Let's add a generic bytes field for now.
        emit WithdrawalInitiatedOnL2(
            _l2Token,
            _l1Recipient,
            msg.sender,
            _amount,
            _extraData // Or specific L1 token if known
        );
    }

    /**
     * @notice Allows the owner to withdraw accidentally sent Ether from this contract.
     * @param _to The address to send the Ether to.
     */
    function withdrawEther(address payable _to) public onlyOwner nonReentrant {
        require(_to != address(0), "Recipient cannot be zero address");
        uint256 balance = address(this).balance;
        require(balance > 0, "No Ether to withdraw");
        // solhint-disable-next-line no-call-value
        (bool success, ) = _to.call{value: balance}("");
        require(success, "Ether transfer failed");
    }

    /**
     * @notice Allows the owner to withdraw accidentally sent ERC20 tokens from this contract.
     * @param _tokenContract The address of the ERC20 token.
     * @param _to The address to send the tokens to.
     * @param _amount The amount of tokens to send.
     */
    function withdrawERC20(address _tokenContract, address _to, uint256 _amount) public onlyOwner nonReentrant {
        require(_to != address(0), "Recipient cannot be zero address");
        IERC20 token = IERC20(_tokenContract);
        token.safeTransfer(_to, _amount);
    }
}
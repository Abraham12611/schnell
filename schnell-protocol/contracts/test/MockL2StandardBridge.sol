// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMockL2StandardBridge {
    function withdrawTo(
        address _l2Token,
        address _to,
        uint256 _amount,
        uint32 _minGasLimit,
        bytes calldata _extraData
    ) external;
    function messenger() external view returns (address);
}

contract MockL2StandardBridge is IMockL2StandardBridge {
    event WithdrawalCalled(
        address indexed l2Token,
        address indexed to,
        uint256 amount,
        uint32 minGasLimit,
        bytes extraData
    );

    address public lastL2Token;
    address public lastTo;
    uint256 public lastAmount;
    uint32 public lastMinGasLimit;
    bytes public lastExtraData;

    address private _messenger;

    constructor(address messengerAddress) {
        _messenger = messengerAddress;
    }

    function withdrawTo(
        address _l2Token,
        address _to,
        uint256 _amount,
        uint32 _minGasLimit,
        bytes calldata _extraData
    ) external override {
        // Check if this contract has been approved to spend _l2Token
        // This mimics the real bridge needing approval
        require(IERC20(_l2Token).allowance(msg.sender, address(this)) >= _amount, "MockL2Bridge: Not approved");
        // Simulate taking the tokens
        // In a real scenario, the bridge would lock/burn them.
        // Here, we just acknowledge the call. For more elaborate tests, tokens could be sent to address(0) or a vault.
        IERC20(_l2Token).transferFrom(msg.sender, address(this), _amount);

        lastL2Token = _l2Token;
        lastTo = _to;
        lastAmount = _amount;
        lastMinGasLimit = _minGasLimit;
        lastExtraData = _extraData;
        emit WithdrawalCalled(_l2Token, _to, _amount, _minGasLimit, _extraData);
    }

    function messenger() external view override returns (address) {
        return _messenger;
    }

    // Helper to check allowance for testing purposes
    function checkAllowance(address token, address spender) external view returns (uint256) {
        return IERC20(token).allowance(spender, address(this));
    }
}
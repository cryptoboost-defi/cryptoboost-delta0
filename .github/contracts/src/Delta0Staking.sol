// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Delta0Staking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable stakingToken;
    uint256 public aprBps;       // 10000 = 100% APR
    uint256 public lockSeconds;  // trajanje locka u sekundama

    struct StakeInfo { uint256 amount; uint256 lastAccrue; uint256 lockedUntil; }
    mapping(address => StakeInfo) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 reward);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);

    constructor(IERC20 _token, uint256 _aprBps, uint256 _lockSeconds, address _owner)
        Ownable(_owner)
    {
        require(address(_token) != address(0), "token=0");
        stakingToken = _token;
        aprBps = _aprBps;
        lockSeconds = _lockSeconds;
    }

    function _accrued(address user) internal view returns (uint256) {
        StakeInfo memory s = stakes[user];
        if (s.amount == 0 || s.lastAccrue == 0) return 0;
        uint256 dt = block.timestamp - s.lastAccrue; // 365d = 31_536_000 s
        return (s.amount * aprBps * dt) / 10_000 / 31_536_000;
    }
    function pendingReward(address user) external view returns (uint256) { return _accrued(user); }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "amount=0");
        StakeInfo storage s = stakes[msg.sender];
        _claimTo(msg.sender);
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        s.amount += amount;
        s.lastAccrue = block.timestamp;
        uint256 newLock = block.timestamp + lockSeconds;
        if (newLock > s.lockedUntil) s.lockedUntil = newLock;
        emit Staked(msg.sender, amount);
    }

    function claim() external nonReentrant {
        uint256 reward = _claimTo(msg.sender);
        emit Claimed(msg.sender, reward);
    }

    function _claimTo(address to) internal returns (uint256 reward) {
        StakeInfo storage s = stakes[to];
        reward = _accrued(to);
        if (reward > 0) {
            s.lastAccrue = block.timestamp;
            stakingToken.safeTransfer(to, reward);
        } else if (s.lastAccrue == 0 && s.amount > 0) {
            s.lastAccrue = block.timestamp;
        }
    }

    function unstake(uint256 amount) external nonReentrant {
        StakeInfo storage s = stakes[msg.sender];
        require(amount > 0 && amount <= s.amount, "bad amount");
        require(block.timestamp >= s.lockedUntil, "locked");
        uint256 reward = _claimTo(msg.sender);
        s.amount -= amount;
        s.lastAccrue = block.timestamp;
        stakingToken.safeTransfer(msg.sender, amount);
        emit Unstaked(msg.sender, amount, reward);
    }

    function setAprBps(uint256 _bps) external onlyOwner { aprBps = _bps; }
    function setLockSeconds(uint256 _sec) external onlyOwner { lockSeconds = _sec; }
}

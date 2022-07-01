// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../libraries/openzeppelin/governance/Governor.sol";
import "../libraries/openzeppelin/governance/extensions/GovernorCountingSimple.sol";
import "../libraries/openzeppelin/governance/extensions/GovernorVotes.sol";

contract MyGovernor is Governor, GovernorCountingSimple, GovernorVotes {
    constructor(IVotes _token) Governor("MyGovernor") GovernorVotes(_token) {}

    function votingDelay() public pure override returns (uint256) {
        return 1; // 1 block
    }

    function votingPeriod() public pure override returns (uint256) {
        return 9; // 2 minutes
    }

    function quorum(uint256 blockNumber) public pure override returns (uint256) {
        return 2e18;
    }
}
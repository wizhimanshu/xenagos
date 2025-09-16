// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title TravelID
 * @dev A smart contract for users to securely and verifiably log their travel history.
 */
contract TravelID {

    // Defines the structure for a single travel log entry
    struct TravelLog {
        string locationName;
        uint256 timestamp;
    }

    // A mapping that links a user's unique blockchain address to their array of travel logs
    // 'private' means other contracts can't directly read it, but we provide a function to do so.
    mapping(address => TravelLog[]) private travelHistory;

    /**
     * @dev Adds a new travel log entry to the caller's history.
     * Only the user themselves can add to their own history.
     * @param _locationName The name of the location visited, e.g., "Goa, India".
     */
    function addTravelLog(string memory _locationName) public {
        // msg.sender is the unique address of the user calling the function
        // block.timestamp is the secure time the transaction was confirmed on the blockchain
        travelHistory[msg.sender].push(TravelLog({
            locationName: _locationName,
            timestamp: block.timestamp
        }));
    }

    /**
     * @dev Retrieves the travel history for a given user address.
     * 'view' means this function only reads data and doesn't cost any gas (money).
     * @param _user The address of the user whose history we want to see.
     * @return A memory array of TravelLog structs.
     */
    function getTravelHistory(address _user) public view returns (TravelLog[] memory) {
        return travelHistory[_user];
    }
}
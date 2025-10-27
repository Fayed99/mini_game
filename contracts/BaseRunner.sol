// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BaseRunner
 * @dev Endless runner game with onchain leaderboard and energy system
 */
contract BaseRunner {
    
    // Constants
    uint256 public constant MAX_DAILY_PLAYS = 3;
    uint256 public constant ENERGY_REFILL_TIME = 1 days;
    
    // Structs
    struct Player {
        uint256 bestScore;
        uint256 totalGames;
        uint256 lastPlayTimestamp;
        uint256 playsToday;
        uint256 lastResetDay;
    }
    
    struct LeaderboardEntry {
        address player;
        uint256 score;
        uint256 timestamp;
    }
    
    // State variables
    mapping(address => Player) public players;
    LeaderboardEntry[] public leaderboard;
    uint256 public totalPlayers;
    
    // Events
    event ScoreSubmitted(address indexed player, uint256 score, uint256 timestamp);
    event NewHighScore(address indexed player, uint256 oldScore, uint256 newScore);
    event EnergyRefilled(address indexed player, uint256 amount);
    
    // Modifiers
    modifier hasEnergy() {
        _updateDailyPlays(msg.sender);
        require(players[msg.sender].playsToday < MAX_DAILY_PLAYS, "No energy left");
        _;
    }
    
    /**
     * @dev Check and reset daily plays if a new day has started
     */
    function _updateDailyPlays(address playerAddress) internal {
        Player storage player = players[playerAddress];
        uint256 currentDay = block.timestamp / ENERGY_REFILL_TIME;
        
        if (player.lastResetDay < currentDay) {
            player.playsToday = 0;
            player.lastResetDay = currentDay;
        }
    }
    
    /**
     * @dev Submit a new score
     */
    function submitScore(uint256 score) external hasEnergy {
        Player storage player = players[msg.sender];
        
        // Initialize player if first time
        if (player.totalGames == 0) {
            totalPlayers++;
            player.lastResetDay = block.timestamp / ENERGY_REFILL_TIME;
        }
        
        // Increment plays
        player.playsToday++;
        player.lastPlayTimestamp = block.timestamp;
        player.totalGames++;
        
        // Update best score if new high score
        if (score > player.bestScore) {
            uint256 oldScore = player.bestScore;
            player.bestScore = score;
            emit NewHighScore(msg.sender, oldScore, score);
            
            // Update leaderboard
            _updateLeaderboard(msg.sender, score);
        }
        
        emit ScoreSubmitted(msg.sender, score, block.timestamp);
    }
    
    /**
     * @dev Update leaderboard with new score
     */
    function _updateLeaderboard(address playerAddress, uint256 score) internal {
        // Check if player already in leaderboard
        int256 existingIndex = -1;
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].player == playerAddress) {
                existingIndex = int256(i);
                break;
            }
        }
        
        // Update existing entry or add new one
        if (existingIndex >= 0) {
            leaderboard[uint256(existingIndex)].score = score;
            leaderboard[uint256(existingIndex)].timestamp = block.timestamp;
        } else {
            leaderboard.push(LeaderboardEntry({
                player: playerAddress,
                score: score,
                timestamp: block.timestamp
            }));
        }
        
        // Sort leaderboard (bubble sort for top entries)
        _sortLeaderboard();
    }
    
    /**
     * @dev Sort leaderboard in descending order by score
     */
    function _sortLeaderboard() internal {
        uint256 length = leaderboard.length;
        for (uint256 i = 0; i < length; i++) {
            for (uint256 j = i + 1; j < length; j++) {
                if (leaderboard[j].score > leaderboard[i].score) {
                    LeaderboardEntry memory temp = leaderboard[i];
                    leaderboard[i] = leaderboard[j];
                    leaderboard[j] = temp;
                }
            }
        }
    }
    
    /**
     * @dev Get top N players from leaderboard
     */
    function getTopPlayers(uint256 count) external view returns (LeaderboardEntry[] memory) {
        uint256 length = leaderboard.length < count ? leaderboard.length : count;
        LeaderboardEntry[] memory topPlayers = new LeaderboardEntry[](length);
        
        for (uint256 i = 0; i < length; i++) {
            topPlayers[i] = leaderboard[i];
        }
        
        return topPlayers;
    }
    
    /**
     * @dev Get player's remaining energy
     */
    function getRemainingEnergy(address playerAddress) external view returns (uint256) {
        Player memory player = players[playerAddress];
        uint256 currentDay = block.timestamp / ENERGY_REFILL_TIME;
        
        // If new day, return max plays
        if (player.lastResetDay < currentDay) {
            return MAX_DAILY_PLAYS;
        }
        
        return MAX_DAILY_PLAYS - player.playsToday;
    }
    
    /**
     * @dev Get player stats
     */
    function getPlayerStats(address playerAddress) external view returns (
        uint256 bestScore,
        uint256 totalGames,
        uint256 remainingEnergy,
        uint256 lastPlayTimestamp
    ) {
        Player memory player = players[playerAddress];
        uint256 currentDay = block.timestamp / ENERGY_REFILL_TIME;
        
        uint256 energy = player.lastResetDay < currentDay 
            ? MAX_DAILY_PLAYS 
            : MAX_DAILY_PLAYS - player.playsToday;
        
        return (
            player.bestScore,
            player.totalGames,
            energy,
            player.lastPlayTimestamp
        );
    }
    
    /**
     * @dev Get player's rank on leaderboard
     */
    function getPlayerRank(address playerAddress) external view returns (uint256) {
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].player == playerAddress) {
                return i + 1; // Return 1-indexed rank
            }
        }
        return 0; // Not on leaderboard
    }
}

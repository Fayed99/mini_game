"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount } from "wagmi";
import { usePlayerStats, useTopPlayers, useSubmitScore } from "./hooks/useContract";
import styles from "./game.module.css";

type GameState = "ready" | "playing" | "gameover" | "leaderboard";

interface Obstacle {
  id: number;
  x: number;
  height: number;
}

interface LeaderboardEntry {
  player: string;
  score: number;
  timestamp: number;
}

export default function Home() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const { address, isConnected } = useAccount();
  
  // Web3 hooks
  const { data: playerStats, refetch: refetchStats } = usePlayerStats(address);
  const { data: topPlayers } = useTopPlayers(10);
  const { submitScore: submitScoreOnchain, isPending, isSuccess } = useSubmitScore();
  
  // Game state
  const [gameState, setGameState] = useState<GameState>("ready");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [playerY, setPlayerY] = useState(300);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [energy, setEnergy] = useState(3);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isJumping, setIsJumping] = useState(false);
  const [submittingScore, setSubmittingScore] = useState(false);
  
  // Game refs
  const gameLoopRef = useRef<number | undefined>(undefined);
  const obstacleIdRef = useRef(0);
  const gameSpeedRef = useRef(5);

  // Initialize the miniapp
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Load player stats from contract or local storage
  useEffect(() => {
    if (isConnected && address && playerStats) {
      const [onchainBestScore, , remainingEnergy] = playerStats as [bigint, bigint, bigint, bigint];
      setBestScore(Number(onchainBestScore));
      setEnergy(Number(remainingEnergy));
    } else if (address) {
      // Fallback to localStorage if contract not deployed
      const saved = localStorage.getItem(`baserunner_${address}`);
      if (saved) {
        const data = JSON.parse(saved);
        setBestScore(data.bestScore || 0);
        setEnergy(data.energy !== undefined ? data.energy : 3);
      }
    }
  }, [isConnected, address, playerStats]);

  // Update leaderboard from contract
  useEffect(() => {
    if (topPlayers && Array.isArray(topPlayers)) {
      const formatted = (topPlayers as Array<{player: string, score: bigint, timestamp: bigint}>).map((entry) => ({
        player: entry.player,
        score: Number(entry.score),
        timestamp: Number(entry.timestamp)
      }));
      setLeaderboard(formatted);
    }
  }, [topPlayers]);

  // Handle successful score submission
  useEffect(() => {
    if (isSuccess && submittingScore) {
      setSubmittingScore(false);
      refetchStats();
      alert("Score submitted onchain! 🎉");
    }
  }, [isSuccess, submittingScore, refetchStats]);

  // Game physics constants
  const GRAVITY = 0.6;
  const JUMP_FORCE = 12; // Positive to jump UP (increase Y which is measured from bottom)
  const MAX_FALL_SPEED = -12; // Terminal velocity for falling
  const GROUND_Y = 80; // Height of ground from bottom
  const PLAYER_SIZE = 40;
  const OBSTACLE_WIDTH = 40;
  const OBSTACLE_GAP = 300;

  // Jump function
  const jump = useCallback(() => {
    if (gameState === "playing" && playerY <= GROUND_Y + 5) {
      setVelocity(JUMP_FORCE);
      setIsJumping(true);
      // Calculate jump animation duration based on physics
      const jumpDuration = Math.floor((2 * JUMP_FORCE / GRAVITY) * 16.67); // Approximate time to reach peak
      setTimeout(() => setIsJumping(false), jumpDuration);
    }
  }, [gameState, playerY, JUMP_FORCE, GROUND_Y, GRAVITY]);

  // Start game
  const startGame = useCallback(() => {
    if (energy <= 0) {
      alert("No energy left! Wait for refill (24 hours) or use tokens to continue.");
      return;
    }
    
    setGameState("playing");
    setScore(0);
    setPlayerY(GROUND_Y);
    setVelocity(0);
    setObstacles([]);
    obstacleIdRef.current = 0;
    gameSpeedRef.current = 5;
    setEnergy(prev => Math.max(0, prev - 1));
    
    // Save energy to localStorage
    if (address) {
      const saved = JSON.parse(localStorage.getItem(`baserunner_${address}`) || "{}");
      localStorage.setItem(`baserunner_${address}`, JSON.stringify({
        ...saved,
        energy: Math.max(0, energy - 1),
        lastPlay: Date.now()
      }));
    }
  }, [energy, GROUND_Y, address]);

  // Game over
  const gameOver = useCallback(() => {
    setGameState("gameover");
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    // Update best score
    const isNewBest = score > bestScore;
    if (isNewBest) {
      setBestScore(score);
    }
    
    // Save to localStorage
    if (address) {
      localStorage.setItem(`baserunner_${address}`, JSON.stringify({
        bestScore: isNewBest ? score : bestScore,
        energy,
        lastPlay: Date.now()
      }));
    }
    
    // Submit to contract if connected and new best score
    if (isConnected && address && isNewBest && process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
      setTimeout(() => {
        if (confirm(`New high score: ${score}! Submit to onchain leaderboard?`)) {
          setSubmittingScore(true);
          try {
            submitScoreOnchain(score);
          } catch (error) {
            console.error("Error submitting score:", error);
            alert("Failed to submit score. Try again later.");
            setSubmittingScore(false);
          }
        }
      }, 500);
    }
  }, [score, bestScore, isConnected, address, energy, submitScoreOnchain]);

  // Check collision
  const checkCollision = (pY: number, obs: Obstacle[]) => {
    // Player hitbox (slightly smaller than visual size for better gameplay feel)
    const playerLeft = 100 + 10;  // Offset hitbox inward
    const playerRight = 100 + PLAYER_SIZE - 10;
    const playerBottom = pY;  // Bottom edge of player
    const playerTop = pY + PLAYER_SIZE;  // Top edge of player
    
    for (const obstacle of obs) {
      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + OBSTACLE_WIDTH;
      const obstacleBottom = GROUND_Y;
      const obstacleTop = GROUND_Y + obstacle.height;
      
      // Perform collision check with adjusted hitbox
      if (
        playerRight > obstacleLeft &&
        playerLeft < obstacleRight &&
        playerBottom < obstacleTop &&
        playerTop > obstacleBottom
      ) {
        return true;
      }
    }
    return false;
  };

  // Main game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = () => {
      setPlayerY(prev => {
        let newY = prev + velocity;
        // If falling below ground, snap to ground
        if (newY <= GROUND_Y) {
          newY = GROUND_Y;
          setVelocity(0);
        } else {
          // Apply gravity with terminal velocity limit
          setVelocity(v => Math.max(MAX_FALL_SPEED, v - GRAVITY));
        }
        return newY;
      });

      setObstacles(prev => {
        const newObstacles = prev
          .map(obs => ({ ...obs, x: obs.x - gameSpeedRef.current }))
          .filter(obs => obs.x > -OBSTACLE_WIDTH);

        // Add new obstacles
        if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < 800 - OBSTACLE_GAP) {
          const height = 40 + Math.random() * 60;
          newObstacles.push({
            id: obstacleIdRef.current++,
            x: 800,
            height
          });
        }

        // Check for passed obstacles (score)
        newObstacles.forEach(obs => {
          if (obs.x + OBSTACLE_WIDTH < 100 && obs.x + OBSTACLE_WIDTH > 100 - gameSpeedRef.current) {
            setScore(s => {
              const newScore = s + 1;
              // Increase speed every 5 points
              if (newScore % 5 === 0) {
                gameSpeedRef.current = Math.min(12, gameSpeedRef.current + 0.5);
              }
              return newScore;
            });
          }
        });

        // Check collision
        if (checkCollision(playerY, newObstacles)) {
          gameOver();
        }

        return newObstacles;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, playerY, velocity, gameOver, MAX_FALL_SPEED]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (gameState === "ready") {
          startGame();
        } else if (gameState === "playing") {
          jump();
        } else if (gameState === "gameover") {
          startGame();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, jump, startGame]);

  // Touch/click controls
  const handleTap = () => {
    if (gameState === "ready") {
      startGame();
    } else if (gameState === "playing") {
      jump();
    } else if (gameState === "gameover") {
      startGame();
    }
  };

  const showLeaderboard = () => {
    setGameState("leaderboard");
  };

  const shareScore = () => {
    const text = `I scored ${score} in Base Runner! 🏃‍♂️ Can you beat me?\n\nPlay now: ${process.env.NEXT_PUBLIC_URL || window.location.origin}`;
    
    // Try to open Farcaster share
    const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
    
    // Open in new window or copy to clipboard as fallback
    if (typeof window !== 'undefined') {
      window.open(farcasterUrl, '_blank');
    } else {
      navigator.clipboard.writeText(text);
      alert("Score copied to clipboard! 📋");
    }
  };

  return (
    <div className={styles.gameContainer} onClick={handleTap}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.stats}>
          <span className={styles.energy}>⚡ {energy}/3</span>
          <span className={styles.scoreDisplay}>Score: {score}</span>
          <span className={styles.bestScore}>Best: {bestScore}</span>
        </div>
        {context?.user?.displayName && (
          <div className={styles.userName}>👋 {context.user.displayName}</div>
        )}
      </div>

      {/* Game Canvas */}
      <div className={styles.gameCanvas}>
        {/* Ground */}
        <div className={styles.ground}></div>
        
        {/* Player */}
        <div
          className={`${styles.player} ${isJumping ? styles.jumping : ""}`}
          style={{ bottom: `${playerY}px` }}
        >
          🏃
        </div>

        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className={styles.obstacle}
            style={{
              left: `${obstacle.x}px`,
              height: `${obstacle.height}px`,
              bottom: `${GROUND_Y}px`
            }}
          />
        ))}

        {/* UI Overlays */}
        {gameState === "ready" && (
          <div className={styles.overlay}>
            <h1 className={styles.gameTitle}>🏃 BASE RUNNER</h1>
            <p className={styles.instructions}>Tap or press SPACE to jump!</p>
            <button className={styles.startButton} onClick={(e) => { e.stopPropagation(); startGame(); }}>
              START GAME
            </button>
            <button className={styles.leaderboardButton} onClick={(e) => { e.stopPropagation(); showLeaderboard(); }}>
              🏆 LEADERBOARD
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className={styles.overlay}>
            <h2 className={styles.gameOverTitle}>GAME OVER!</h2>
            <div className={styles.finalScore}>
              <p>Score: <strong>{score}</strong></p>
              {score > bestScore && <p className={styles.newRecord}>🎉 NEW RECORD!</p>}
              <p>Best: {bestScore}</p>
              {submittingScore && <p>⏳ Submitting to blockchain...</p>}
              {isPending && <p>⏳ Waiting for confirmation...</p>}
            </div>
            <div className={styles.gameOverButtons}>
              <button className={styles.retryButton} onClick={(e) => { e.stopPropagation(); startGame(); }}>
                RETRY ({energy} ⚡ left)
              </button>
              <button className={styles.shareButton} onClick={(e) => { e.stopPropagation(); shareScore(); }}>
                📢 SHARE
              </button>
              <button className={styles.leaderboardButton} onClick={(e) => { e.stopPropagation(); showLeaderboard(); }}>
                🏆 LEADERBOARD
              </button>
            </div>
          </div>
        )}

        {gameState === "leaderboard" && (
          <div className={styles.overlay}>
            <h2 className={styles.leaderboardTitle}>🏆 TOP PLAYERS</h2>
            <div className={styles.leaderboardList}>
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <div key={index} className={styles.leaderboardEntry}>
                    <span className={styles.rank}>#{index + 1}</span>
                    <span className={styles.playerAddress}>
                      {entry.player.slice(0, 6)}...{entry.player.slice(-4)}
                    </span>
                    <span className={styles.playerScore}>{entry.score}</span>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#aaa' }}>
                  {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS 
                    ? "No scores yet. Be the first!" 
                    : "Deploy contract to enable leaderboard"}
                </p>
              )}
            </div>
            <button className={styles.backButton} onClick={(e) => { e.stopPropagation(); setGameState("ready"); }}>
              BACK
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p>🔗 Powered by Base</p>
        {!isConnected && <p className={styles.connectWallet}>Connect wallet to save scores onchain</p>}
      </div>
    </div>
  );
}

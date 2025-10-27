# Base Runner Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Base Runner Game                         │
│                     (Next.js Frontend)                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   MiniKit    │  │  LocalStorage│  │ Smart Contract│
│  (Farcaster) │  │   (Backup)   │  │  (Base Chain) │
└──────────────┘  └──────────────┘  └──────────────┘
        │                  │                  │
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ User Context │  │ Local Scores │  │  Leaderboard │
│ Share Scores │  │ Energy Track │  │ Energy System│
│ Display Name │  │              │  │ Best Scores  │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Component Architecture

```
app/
├── page.tsx
│   ├── Game State Management
│   │   ├── gameState: 'ready' | 'playing' | 'gameover' | 'leaderboard'
│   │   ├── score, bestScore, energy
│   │   └── obstacles[], playerY, velocity
│   │
│   ├── Game Loop (60 FPS)
│   │   ├── Physics Engine
│   │   │   ├── Gravity
│   │   │   ├── Jump Force
│   │   │   └── Collision Detection
│   │   │
│   │   ├── Obstacle Management
│   │   │   ├── Generation
│   │   │   ├── Movement
│   │   │   └── Cleanup
│   │   │
│   │   └── Score Tracking
│   │       ├── Increment on pass
│   │       └── Speed increase
│   │
│   ├── User Interface
│   │   ├── Header (Stats, Energy, User)
│   │   ├── Game Canvas
│   │   │   ├── Ground
│   │   │   ├── Player (🏃)
│   │   │   └── Obstacles
│   │   │
│   │   └── Overlays
│   │       ├── Ready Screen
│   │       ├── Game Over Screen
│   │       └── Leaderboard Screen
│   │
│   └── Web3 Integration
│       ├── useAccount (Wallet)
│       ├── usePlayerStats (Read)
│       ├── useTopPlayers (Read)
│       └── useSubmitScore (Write)
│
├── game.module.css
│   ├── Layout & Containers
│   ├── Game Elements
│   │   ├── Player animations
│   │   ├── Obstacle styles
│   │   └── Ground textures
│   │
│   ├── UI Components
│   │   ├── Buttons
│   │   ├── Overlays
│   │   └── Leaderboard
│   │
│   └── Responsive Design
│       └── Mobile breakpoints
│
├── contract.ts
│   ├── CONTRACT_ADDRESS
│   ├── CONTRACT_ABI
│   └── CHAIN_ID
│
└── hooks/
    └── useContract.ts
        ├── useRemainingEnergy()
        ├── usePlayerStats()
        ├── useTopPlayers()
        ├── usePlayerRank()
        └── useSubmitScore()
```

## Smart Contract Architecture

```solidity
BaseRunner.sol
├── Constants
│   ├── MAX_DAILY_PLAYS = 3
│   └── ENERGY_REFILL_TIME = 1 day
│
├── Structs
│   ├── Player
│   │   ├── bestScore
│   │   ├── totalGames
│   │   ├── lastPlayTimestamp
│   │   ├── playsToday
│   │   └── lastResetDay
│   │
│   └── LeaderboardEntry
│       ├── player (address)
│       ├── score
│       └── timestamp
│
├── State Variables
│   ├── mapping(address => Player) players
│   ├── LeaderboardEntry[] leaderboard
│   └── uint256 totalPlayers
│
├── Functions
│   ├── submitScore(uint256 score)
│   │   ├── Check energy
│   │   ├── Update player stats
│   │   ├── Update leaderboard
│   │   └── Emit events
│   │
│   ├── getTopPlayers(uint256 count)
│   ├── getRemainingEnergy(address)
│   ├── getPlayerStats(address)
│   └── getPlayerRank(address)
│
└── Events
    ├── ScoreSubmitted
    ├── NewHighScore
    └── EnergyRefilled
```

## Data Flow

### Score Submission Flow

```
User Plays Game
       │
       ▼
   Game Over
       │
       ▼
Is New Best Score?
       │
       ├─ No ──► Continue
       │
       └─ Yes ──► Prompt User
                      │
                      ▼
              Submit to Contract?
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
         Yes                     No
          │                       │
          ▼                       ▼
   Call submitScore()      Save to localStorage
          │                       │
          ▼                       │
   Wait for Transaction           │
          │                       │
          ▼                       │
   Transaction Confirmed          │
          │                       │
          ▼                       │
   Refetch Player Stats           │
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
               Update UI
                      │
                      ▼
            Show Success Message
```

### Energy System Flow

```
Player Starts Game
       │
       ▼
Check Energy > 0?
       │
   ┌───┴───┐
   │       │
  Yes     No
   │       │
   │       └──► Show "No Energy" Alert
   │
   ▼
Decrement Energy
   │
   ▼
Save to Storage
   │
   ▼
Start Game
   │
   ▼
Game Runs
   │
   ▼
Game Over
   │
   ▼
Check if 24 Hours Passed
   │
   └──► If Yes: Reset Energy to 3
```

### Leaderboard Update Flow

```
Contract Event: NewHighScore
       │
       ▼
Frontend Listens
       │
       ▼
Trigger Refetch
       │
       ▼
Call getTopPlayers(10)
       │
       ▼
Receive Data
       │
       ▼
Format Addresses
       │
       ▼
Update State
       │
       ▼
Re-render Leaderboard
```

## Integration Points

### 1. Farcaster (MiniKit)
- **User Context**: Get display name, FID
- **Sharing**: Post scores to feed
- **Auth**: Verify user identity

### 2. Base Blockchain
- **Network**: Base Sepolia (testnet) or Base Mainnet
- **Contract**: BaseRunner.sol
- **Transactions**: Score submissions (write)
- **Queries**: Stats, leaderboard (read)

### 3. Wallet Connection (Wagmi)
- **Connect**: Coinbase Wallet, MetaMask, etc.
- **Sign**: Transactions for score submission
- **Balance**: Check for gas fees

### 4. Vercel Deployment
- **Hosting**: Static site + API routes
- **Environment**: Configure contract address
- **Domain**: Custom or .vercel.app
- **Auto-deploy**: On git push

## Security Considerations

1. **Smart Contract**
   - ✅ No re-entrancy issues (no external calls)
   - ✅ Energy checks with modifiers
   - ✅ Input validation on scores
   - ✅ Timestamp-based resets

2. **Frontend**
   - ✅ Client-side validation
   - ✅ Transaction error handling
   - ✅ Fallback to localStorage
   - ✅ No private key handling

3. **Privacy**
   - ✅ Only addresses stored onchain
   - ✅ No personal data
   - ✅ Scores are public by design

## Performance Optimizations

1. **Game Loop**
   - RequestAnimationFrame (60 FPS)
   - Minimal state updates
   - Efficient collision detection

2. **Rendering**
   - CSS transforms (GPU accelerated)
   - Conditional rendering
   - Lazy loading for leaderboard

3. **Contract Calls**
   - Read caching via React Query
   - Batched updates
   - Optimistic UI updates

4. **Bundle Size**
   - Tree shaking
   - Code splitting
   - CSS modules (scoped)

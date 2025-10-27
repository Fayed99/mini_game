# 🏃 Base Runner

**An onchain endless runner game built on Base!**

Tap to jump, survive obstacles, and compete on the blockchain leaderboard. Built with Next.js, MiniKit, and deployed as a Farcaster mini app.

## 🎮 Features

- **Endless Runner Gameplay** - Simple tap-to-jump mechanics
- **Onchain Leaderboard** - Compete with players worldwide on Base
- **Energy System** - 3 runs per day (resets every 24 hours)
- **Farcaster Integration** - Share your scores directly to Farcaster
- **Web3 Native** - Scores stored permanently on blockchain
- **Mobile Optimized** - Play anywhere, anytime

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play!

## 📦 Project Structure

```
├── app/
│   ├── page.tsx              # Main game component
│   ├── game.module.css       # Game styles
│   ├── contract.ts           # Contract ABI and config
│   └── hooks/
│       └── useContract.ts    # Web3 hooks
├── contracts/
│   └── BaseRunner.sol        # Smart contract
├── minikit.config.ts         # MiniKit configuration
├── DEPLOYMENT.md             # Detailed deployment guide
└── README.md                 # This file
```

## 🎯 How to Play

1. **Tap** or press **SPACE** to jump
2. Avoid red obstacles
3. Each obstacle cleared = **+1 point**
4. Game speeds up every 5 points
5. You have **3 runs per day**
6. Beat your high score and climb the leaderboard!

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions including:
- Smart contract deployment to Base
- Vercel deployment setup  
- Account association with Farcaster
- Publishing to Base app

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/mini_game)

**Required Environment Variables:**
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - Your deployed BaseRunner contract address (optional for local dev)
- `NEXT_PUBLIC_URL` - Your Vercel domain (auto-set by Vercel)

## 🔗 Smart Contract

The game uses a Solidity smart contract on Base to:
- Store player high scores
- Manage daily energy (3 plays per day)
- Track leaderboard rankings
- Emit events for score submissions

Contract: `/contracts/BaseRunner.sol`

**Networks:**
- Base Sepolia (Testnet): Chain ID 84532
- Base Mainnet: Chain ID 8453

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Web3**: Wagmi, Viem, OnChainKit
- **MiniKit**: Farcaster MiniApp SDK
- **Blockchain**: Base (Optimistic Rollup)
- **Styling**: CSS Modules
- **Deployment**: Vercel

## 📝 Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🎨 Customization

You can easily customize the game by editing:

- `minikit.config.ts` - App metadata, name, description, colors
- `app/game.module.css` - Visual styling, colors, animations
- `contracts/BaseRunner.sol` - Game mechanics, energy system, rewards

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT

## 🙏 Acknowledgments

Built with:
- [Base](https://base.org) - Ethereum L2 blockchain
- [Farcaster](https://farcaster.xyz) - Decentralized social protocol
- [MiniKit](https://docs.farcaster.xyz/miniapps) - Mini app framework
- [OnChainKit](https://onchainkit.xyz) - React components for Base

---

**Have fun and happy jumping! 🏃‍♂️💨**

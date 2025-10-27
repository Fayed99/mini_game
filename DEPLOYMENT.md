# 🏃 Base Runner - Deployment Guide

An endless runner game with onchain leaderboard on Base! 

## 🎮 Game Features

- ✅ **Tap-to-Jump Mechanics** - Simple, addictive gameplay
- ✅ **Onchain Leaderboard** - Compete with players worldwide
- ✅ **Energy System** - 3 runs per day (resets daily)
- ✅ **Score Tracking** - Your best score saved onchain
- ✅ **Farcaster Integration** - Share your scores
- ✅ **Web3 Native** - Built on Base blockchain

## 📋 Prerequisites

- Base app account
- Vercel account
- Wallet (Coinbase Wallet or similar)
- Base Sepolia ETH (for testing)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to play!

## 📝 Smart Contract Deployment

The game uses a smart contract on Base to store scores and manage the energy system.

### Step 1: Deploy the Contract

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file `BaseRunner.sol`
3. Copy the contract from `/contracts/BaseRunner.sol`
4. Compile with Solidity 0.8.20+
5. Deploy to **Base Sepolia** (testnet) or **Base Mainnet**

**Network Details:**
- **Base Sepolia**: RPC: `https://sepolia.base.org`, Chain ID: 84532
- **Base Mainnet**: RPC: `https://mainnet.base.org`, Chain ID: 8453

### Step 2: Get Testnet Tokens

For Base Sepolia:
1. Get Sepolia ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
2. Bridge to Base Sepolia using [Base Bridge](https://bridge.base.org/)

### Step 3: Configure Contract Address

After deploying, create a `.env.local` file:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_URL=https://your-vercel-app.vercel.app
```

Update `/app/contract.ts` with your deployed contract address.

## 🌐 Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Base Runner game ready"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: Your deployed contract address
   - `NEXT_PUBLIC_URL`: Your Vercel domain (e.g., `https://base-runner.vercel.app`)

4. Deploy!

### 3. Important: Disable Deployment Protection

⚠️ **Required for Farcaster integration:**

1. Go to Vercel Dashboard → Your Project → Settings
2. Navigate to "Deployment Protection"
3. Toggle "Vercel Authentication" to **OFF**
4. Click Save

## 🔗 Base Integration

### Step 1: Update Manifest

The manifest is already configured in `minikit.config.ts`. Make sure your URLs are correct:

```typescript
const ROOT_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
```

### Step 2: Sign Account Association

1. Go to [Base Build Account Association Tool](https://www.base.dev/preview?tab=account)
2. Enter your Vercel domain (e.g., `base-runner.vercel.app`)
3. Click "Submit"
4. Click "Verify" and follow prompts to sign with your Farcaster account
5. Copy the generated `accountAssociation` object

### Step 3: Update minikit.config.ts

Replace the empty `accountAssociation` object:

```typescript
accountAssociation: {
  "header": "your_header_here",
  "payload": "your_payload_here",
  "signature": "your_signature_here"
},
```

### Step 4: Push to Production

```bash
git add minikit.config.ts
git commit -m "Add account association"
git push origin main
```

Vercel will auto-deploy your changes.

## ✅ Verify & Preview

1. Go to [base.dev/preview](https://base.dev/preview)
2. Enter your app URL
3. Verify:
   - ✅ Embeds display correctly
   - ✅ App launches properly
   - ✅ Account association is valid
   - ✅ Metadata is complete

## 🎉 Publish to Base

1. Open the Base app
2. Create a new post
3. Add your game URL (e.g., `https://base-runner.vercel.app`)
4. The Base app will automatically create a rich preview
5. Post to publish!

Your game is now live on Base! 🚀

## 🎮 How to Play

1. **Start Game**: Click "START GAME" or tap anywhere
2. **Jump**: Tap/click or press SPACE to jump over obstacles
3. **Score**: Each obstacle you clear = +1 point
4. **Energy**: You have 3 runs per day (resets every 24 hours)
5. **Leaderboard**: Your best score is saved onchain
6. **Share**: Share your score on Farcaster after each game

## 🔧 Advanced Features (Coming Soon)

- [ ] Token Rewards for top players
- [ ] Energy refill with tokens
- [ ] Power-ups and skins
- [ ] Multiplayer races
- [ ] NFT achievements

## 📚 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: CSS Modules
- **Web3**: Wagmi, Viem, OnChainKit
- **MiniKit**: Farcaster MiniApp SDK
- **Blockchain**: Base (Ethereum L2)
- **Deployment**: Vercel

## 🐛 Troubleshooting

### Contract not working?
- Ensure `NEXT_PUBLIC_CONTRACT_ADDRESS` is set in Vercel
- Check you're on the correct network (Base Sepolia or Base Mainnet)
- Verify contract is deployed and verified

### Scores not saving?
- Connect your wallet
- Make sure you have Base ETH for gas
- Check browser console for errors

### Energy not refilling?
- Wait 24 hours from last play
- Check contract time with blockchain explorer

### Account association failed?
- Ensure Deployment Protection is OFF in Vercel
- Your domain must be publicly accessible
- Try re-signing the manifest

## 📞 Support

- Base Docs: https://docs.base.org
- MiniKit Docs: https://docs.farcaster.xyz/miniapps
- Vercel Docs: https://vercel.com/docs

## 📄 License

MIT

---

Built with ❤️ on Base 🔵

# Environment Setup Guide

## Local Development (.env.local)

Create a `.env.local` file in the root directory:

```bash
# Optional - Only needed if you deploy the smart contract
NEXT_PUBLIC_CONTRACT_ADDRESS=

# Auto-set by Vercel, or set manually for local testing
NEXT_PUBLIC_URL=http://localhost:3000

# Optional - OnChainKit API Key from Coinbase Developer Platform
# Get one at: https://portal.cdp.coinbase.com/
NEXT_PUBLIC_ONCHAINKIT_API_KEY=
```

## Vercel Production

Add these environment variables in your Vercel dashboard:

### Required
- `NEXT_PUBLIC_URL` - Your Vercel app URL (auto-populated)
  - Example: `https://base-runner.vercel.app`

### Optional (Enable after contract deployment)
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - Your deployed BaseRunner contract address
  - Example: `0x1234567890123456789012345678901234567890`

### Optional (For enhanced features)
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY` - CDP API key for OnChainKit features

## Network Configuration

The game is configured to work on Base networks:

**Base Sepolia (Testnet)**
- Chain ID: 84532
- RPC: https://sepolia.base.org
- Explorer: https://sepolia.basescan.org
- Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

**Base Mainnet (Production)**
- Chain ID: 8453
- RPC: https://mainnet.base.org
- Explorer: https://basescan.org

## Smart Contract Deployment

### Using Remix IDE

1. Go to https://remix.ethereum.org/
2. Create new file `BaseRunner.sol`
3. Copy contract from `/contracts/BaseRunner.sol`
4. Compile with Solidity 0.8.20+
5. Deploy to Base Sepolia or Base Mainnet
6. Copy contract address
7. Add to environment variables

### Using Hardhat (Advanced)

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat
npx hardhat init

# Create deploy script
# scripts/deploy.js
```

Example deploy script:

```javascript
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const BaseRunner = await hre.ethers.getContractFactory("BaseRunner");
  const baseRunner = await BaseRunner.deploy();

  await baseRunner.deployed();

  console.log("BaseRunner deployed to:", baseRunner.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Deploy:
```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

## Wallet Setup

### For Testing (Base Sepolia)

1. Install Coinbase Wallet or MetaMask
2. Add Base Sepolia network
3. Get testnet ETH from faucet
4. Connect wallet in the app

### For Production (Base Mainnet)

1. Ensure wallet has Base ETH for gas
2. Connect wallet
3. Sign transactions to submit scores

## Farcaster Integration

### Account Association

1. Deploy your app to Vercel
2. Disable "Deployment Protection" in Vercel settings
3. Go to https://base.dev/preview?tab=account
4. Enter your app URL
5. Sign with your Farcaster account
6. Copy the generated credentials
7. Update `minikit.config.ts`:

```typescript
accountAssociation: {
  "header": "your_header_here",
  "payload": "your_payload_here", 
  "signature": "your_signature_here"
}
```

## Testing Checklist

### Local Testing (No Contract)
- [ ] Game loads at localhost:3000
- [ ] Can start game
- [ ] Jump works (tap/space)
- [ ] Obstacles appear and move
- [ ] Collision detection works
- [ ] Score increases
- [ ] Game over triggers
- [ ] Energy decreases
- [ ] Best score saves to localStorage

### With Contract (Testnet)
- [ ] Wallet connects
- [ ] Can read player stats from contract
- [ ] Can submit score transaction
- [ ] Transaction confirms
- [ ] Leaderboard loads from contract
- [ ] Energy tracked onchain
- [ ] Events emitted correctly

### Vercel Deployment
- [ ] App builds successfully
- [ ] Environment variables set
- [ ] App loads at Vercel URL
- [ ] All game features work
- [ ] Mobile responsive
- [ ] Farcaster embeds display

### Farcaster Integration
- [ ] Account association valid
- [ ] App launches from Base app
- [ ] User context loads
- [ ] Share to Farcaster works
- [ ] Manifest metadata correct

## Troubleshooting

### "Contract not found" Error
**Problem**: `NEXT_PUBLIC_CONTRACT_ADDRESS` not set or invalid  
**Solution**: Check environment variables, ensure contract is deployed to correct network

### "No energy left" Even After 24 Hours
**Problem**: Energy not resetting properly  
**Solution**: Check contract's `lastResetDay` calculation, may need to clear localStorage

### Transactions Failing
**Problem**: Insufficient gas, wrong network, or contract error  
**Solution**: 
- Ensure wallet has Base ETH
- Verify connected to correct network (Base Sepolia/Mainnet)
- Check contract has no errors
- View transaction details in block explorer

### Game Not Loading
**Problem**: JavaScript errors or missing dependencies  
**Solution**:
- Check browser console for errors
- Run `npm install` to ensure all deps installed
- Clear browser cache
- Try different browser

### Farcaster Embed Not Showing
**Problem**: Manifest not configured or deployment protection enabled  
**Solution**:
- Verify account association credentials in `minikit.config.ts`
- Disable Vercel Deployment Protection
- Check manifest at `/.well-known/farcaster.json`
- Validate at base.dev/preview

## Security Best Practices

1. **Never commit** `.env.local` to git
2. **Use testnet** (Base Sepolia) for initial testing
3. **Verify contract** on block explorer before going live
4. **Test thoroughly** before mainnet deployment
5. **Monitor gas costs** for contract interactions
6. **Set spending limits** in wallet for safety

## Getting Help

- Base Docs: https://docs.base.org
- MiniKit Docs: https://docs.farcaster.xyz/miniapps
- OnChainKit: https://onchainkit.xyz
- Vercel Docs: https://vercel.com/docs
- Wagmi Docs: https://wagmi.sh

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Environment Variables Summary

| Variable | Required | Where | Example |
|----------|----------|-------|---------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | No* | Vercel + Local | `0x1234...` |
| `NEXT_PUBLIC_URL` | Yes | Vercel | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | No | Vercel + Local | `your_api_key` |

*Required only if you want onchain features (leaderboard, energy system on blockchain)

## Ready to Deploy!

Once your environment is set up:

1. ✅ Test locally with `npm run dev`
2. ✅ Deploy contract (optional)
3. ✅ Set environment variables
4. ✅ Push to GitHub
5. ✅ Deploy to Vercel
6. ✅ Configure Farcaster
7. ✅ Publish to Base app

Happy building! 🚀

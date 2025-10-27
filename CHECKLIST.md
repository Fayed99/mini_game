# 🚀 Base Runner - Deployment Checklist

Use this checklist to deploy your Base Runner game step by step.

## ✅ Pre-Deployment

### Local Development
- [ ] Dependencies installed (`npm install`)
- [ ] Game runs locally (`npm run dev`)
- [ ] Game mechanics work (jump, obstacles, scoring)
- [ ] Energy system functions
- [ ] Local storage saves scores
- [ ] No console errors

### Code Review
- [ ] All TODOs addressed or documented
- [ ] Error handling in place
- [ ] TypeScript errors resolved
- [ ] Linting passed (`npm run lint`)
- [ ] Build successful (`npm run build`)

## 🔗 Smart Contract (Optional but Recommended)

### Contract Deployment
- [ ] Contract reviewed and tested
- [ ] Testnet tokens acquired (Base Sepolia ETH)
- [ ] Wallet configured for Base network
- [ ] Contract deployed to Base Sepolia
- [ ] Contract address saved
- [ ] Contract verified on block explorer (optional)

### Contract Testing
- [ ] Can call `submitScore()` successfully
- [ ] `getPlayerStats()` returns correct data
- [ ] `getTopPlayers()` returns leaderboard
- [ ] `getRemainingEnergy()` calculates correctly
- [ ] Energy resets after 24 hours
- [ ] Events emitted properly

## 📦 Vercel Deployment

### GitHub Setup
- [ ] Code committed to GitHub
- [ ] Repository is public or accessible to Vercel
- [ ] `.env.local` NOT committed (in .gitignore)
- [ ] `README.md` updated with your info

### Vercel Configuration
- [ ] Vercel account created
- [ ] Repository imported to Vercel
- [ ] Build settings configured (Next.js preset)
- [ ] Environment variables added:
  - [ ] `NEXT_PUBLIC_URL` (auto-set by Vercel)
  - [ ] `NEXT_PUBLIC_CONTRACT_ADDRESS` (if contract deployed)
  - [ ] `NEXT_PUBLIC_ONCHAINKIT_API_KEY` (optional)

### Deployment Protection
- [ ] Navigate to Settings → Deployment Protection
- [ ] Toggle "Vercel Authentication" to **OFF**
- [ ] Click Save

### First Deployment
- [ ] Trigger deployment (push to main or manual)
- [ ] Build succeeds
- [ ] Preview deployment works
- [ ] Production deployment works
- [ ] Visit production URL
- [ ] Game loads and plays correctly

## 🎯 Farcaster Integration

### Account Association
- [ ] App deployed and accessible publicly
- [ ] Go to https://base.dev/preview?tab=account
- [ ] Enter your Vercel domain (e.g., `base-runner.vercel.app`)
- [ ] Click "Submit"
- [ ] Click "Verify"
- [ ] Sign with Farcaster account
- [ ] Copy `accountAssociation` object

### Manifest Update
- [ ] Open `minikit.config.ts`
- [ ] Replace empty `accountAssociation` with copied values
- [ ] Verify `header`, `payload`, and `signature` are all filled
- [ ] Update other metadata if needed (name, description, etc.)
- [ ] Commit and push changes
- [ ] Wait for Vercel to redeploy

### Manifest Verification
- [ ] Go to https://base.dev/preview
- [ ] Enter your app URL
- [ ] Check "Embeds" tab - should show rich preview
- [ ] Check "Account association" tab - should show verified
- [ ] Check "Metadata" tab - all fields populated
- [ ] Test launch button - app should open

## 🧪 Production Testing

### Functionality Tests
- [ ] Game loads on mobile
- [ ] Game loads on desktop
- [ ] Tap/touch controls work
- [ ] Keyboard controls work (space/arrow)
- [ ] Score updates in real-time
- [ ] Game over triggers correctly
- [ ] Energy system works
- [ ] Best score saves

### Web3 Tests (if contract deployed)
- [ ] Wallet connects (Coinbase Wallet, MetaMask)
- [ ] Can read player stats
- [ ] Can submit score transaction
- [ ] Transaction confirms on Base
- [ ] Leaderboard loads from chain
- [ ] Rank displays correctly
- [ ] Energy syncs with contract

### Farcaster Tests
- [ ] User display name shows in header
- [ ] Share button opens Farcaster composer
- [ ] Score text pre-populated
- [ ] Can post to Farcaster
- [ ] Post includes app link
- [ ] App embed shows in feed

### Cross-Browser Testing
- [ ] Chrome/Edge
- [ ] Safari (iOS/macOS)
- [ ] Firefox
- [ ] Mobile browsers

## 📣 Publishing

### Create Post on Base
- [ ] Open Base app (https://base.org/app or mobile app)
- [ ] Create new post
- [ ] Add your game URL
- [ ] Verify rich embed appears
- [ ] Add description/context
- [ ] Post to publish

### Verify Live
- [ ] Post appears in Base feed
- [ ] Embed shows game preview
- [ ] Launch button works
- [ ] Game opens in mini app view
- [ ] All features functional

## 📊 Monitoring

### Post-Launch
- [ ] Monitor Vercel analytics
- [ ] Check error logs
- [ ] Watch transaction activity (if using contract)
- [ ] Monitor gas costs
- [ ] Gather user feedback

### Contract Monitoring (if deployed)
- [ ] Check block explorer for transactions
- [ ] Verify events are emitting
- [ ] Monitor leaderboard updates
- [ ] Track player count
- [ ] Check energy resets

## 🎨 Optional Enhancements

### Graphics
- [ ] Add custom game icons
- [ ] Create screenshot images
- [ ] Design splash screen
- [ ] Add game logo

### Features
- [ ] Add sound effects
- [ ] Implement power-ups
- [ ] Add character skins
- [ ] Create token rewards
- [ ] Build achievement system

### Marketing
- [ ] Create demo video
- [ ] Write announcement post
- [ ] Share on Twitter/X
- [ ] Post in Base Discord
- [ ] Submit to app directories

## 🐛 Troubleshooting

If something isn't working:

1. **Check Vercel logs** - Look for build/runtime errors
2. **Check browser console** - Look for JavaScript errors
3. **Verify environment variables** - Ensure all required vars set
4. **Test contract separately** - Use block explorer
5. **Check network** - Confirm on correct chain (Base)
6. **Verify manifest** - Use base.dev/preview tool
7. **Review documentation** - See DEPLOYMENT.md for details

## ✨ Success Criteria

Your deployment is successful when:

- ✅ Game loads without errors
- ✅ Gameplay is smooth and fun
- ✅ Scores save (locally or onchain)
- ✅ Leaderboard displays (mock or real)
- ✅ Energy system works
- ✅ Farcaster integration functional
- ✅ Mobile responsive
- ✅ Published to Base app
- ✅ Users can play and enjoy!

## 🎉 Congratulations!

Once all items are checked, your Base Runner game is live!

**Next Steps:**
- Share with friends
- Gather feedback
- Iterate and improve
- Build more features
- Create more games!

---

Need help? Check:
- `BUILD_SUMMARY.md` - What was built
- `DEPLOYMENT.md` - Detailed instructions
- `ENVIRONMENT.md` - Environment setup
- `ARCHITECTURE.md` - Technical details

Happy gaming on Base! 🏃‍♂️💨🔵

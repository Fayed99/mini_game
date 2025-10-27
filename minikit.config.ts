const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: ""
  },
  miniapp: {
    version: "1",
    name: "Base Runner", 
    subtitle: "Tap to Jump, Compete Onchain", 
    description: "An endless runner game with onchain leaderboard on Base. Tap to jump, survive obstacles, and compete with players worldwide!",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#0052FF",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "gaming",
    tags: ["game", "runner", "onchain", "leaderboard", "base", "web3"],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`, 
    tagline: "Tap. Jump. Dominate the Base.",
    ogTitle: "Base Runner - Onchain Endless Runner Game",
    ogDescription: "Test your reflexes in Base Runner! Tap to jump over obstacles and compete on the onchain leaderboard.",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
} as const;


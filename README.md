# 🀄 Mahjong League - Decentralized Gaming Platform

**A competitive Mahjong solitaire platform powered by Massa blockchain technology**

![Mahjong League](https://img.shields.io/badge/Status-Beta-orange) ![Massa](https://img.shields.io/badge/Blockchain-Massa-blue) ![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)

## 🎮 What is Mahjong League?

Mahjong League is a decentralized gaming platform that combines the classic tile-matching gameplay of Mahjong solitaire with blockchain technology. Players compete in timed leagues, stake MASSA tokens, and win rewards based on their performance. The entire system runs autonomously on the Massa blockchain with smart contracts handling league management, player registration, and prize distribution.

### 🎯 Core Features

- **🏆 Competitive Leagues**: Three difficulty levels with different entry fees and rewards
- **⏱️ Timed Gameplay**: Fast-paced 3-minute league sessions
- **💰 Stake-to-Play**: Entry fees in MASSA tokens with winner-takes-most distribution
- **🤖 Autonomous Operation**: Smart contracts handle everything automatically
- **📊 Real-time Leaderboards**: Live rankings and statistics
- **🎨 Modern UI**: Responsive design with custom tile shapes and animations

## Project Overview

The Mahjong League contract manages competitive Mahjong leagues with the following features:

- **Three Difficulty Levels**: Easy, Normal, and Hard
- **Automated League Management**: Leagues run for 3 minutes each
- **Tiered Entry Fees**:
  - Easy: 1 MASSA
  - Normal: 2 MASSA
  - Hard: 3 MASSA
- **Automated Rewards**:
  - Top 10% of players share 90% of the prize pool
  - 10% dev fee per league
- **On-chain Storage**: All player data and league states are stored on the Massa blockchain

## 🎲 Game Rules & Mechanics

### Mahjong Solitaire Gameplay
- **Objective**: Clear all tiles by matching identical pairs
- **Tile Matching**: Only free tiles (not blocked by others) can be selected
- **Custom Tiles**: Six unique tile types with distinct visual designs:
  - 🔺 Triangle (Red)
  - ⬜ Square (Green) 
  - 🔵 Circle (Blue)
  - ⭐ Star (Yellow)
  - ☢️ Biohazard (Orange)
  - ☢️ Radioactive (Purple)

### League System

#### 🟢 Easy League
- **Entry Fee**: 1 MASSA token
- **Board Size**: 8×6 grid, 2 layers (48 tiles)
- **Target Audience**: Beginners and casual players

#### 🟡 Normal League  
- **Entry Fee**: 2 MASSA tokens
- **Board Size**: 10×8 grid, 3 layers (72 tiles)
- **Target Audience**: Intermediate players

#### 🔴 Hard League
- **Entry Fee**: 3 MASSA tokens  
- **Board Size**: 12×10 grid, 4 layers (96 tiles)
- **Target Audience**: Expert players

### 💎 Prize Distribution
- **League Duration**: 3 minutes per league
- **Winner Selection**: Top 10% of players who complete the game
- **Prize Pool**: 90% of total entry fees collected
- **Dev Fee**: 10% for platform maintenance
- **Automatic Payout**: Winners receive rewards instantly when league ends

## Prerequisites

Before you start, you'll need:

- Node.js and npm (v18 or later recommended)
- A funded Massa wallet and your secret key
- Basic understanding of AssemblyScript and Massa blockchain

## 🚀 Technology Stack

### Frontend ([frontend/](frontend/))
- **Framework**: Next.js 15.4.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS animations
- **State Management**: React hooks
- **Build Tool**: Turbopack

### Smart Contract ([assembly/contracts/](assembly/contracts/))
- **Language**: AssemblyScript
- **Blockchain**: Massa
- **SDK**: @massalabs/massa-as-sdk
- **Storage**: On-chain player data and league states

### Integration
- **Web3 Library**: @massalabs/massa-web3
- **Environment**: Local buildnet for development
- **Deployment**: Automated via npm scripts

## Building and Deploying

### Environment Setup
Create `.env` file in project root:
```env
PRIVATE_KEY=your_massa_private_key_here
JSON_RPC_URL_PUBLIC=https://test.massa.net/api/v2:33035
```

Create `frontend/.env` file:
```env
VITE_MASSA_RPC_URL=http://127.0.0.1:33035
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
VITE_PRIVATE_KEY=your_massa_private_key_here
VITE_NETWORK=buildnet
VITE_CHAIN_ID=77658366
```

### Step 1: Build the Contract

```bash
npm run build
```

This will compile your AssemblyScript contract into WebAssembly.

### Step 2: Configure Environment Variables

Create a `.env` file in the project root:

```env
PRIVATE_KEY="Your_private_key_here"
```

### Step 3: Deploy to Massa Buildnet

Ensure you have Buildnet MAS tokens (get them from the faucet), then:

```bash
npm run deploy
```

Save the contract address displayed after deployment.

### Step 4: Run Frontend
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to play!

## 🗺️ Roadmap

### Phase 1: Core Platform (✅ Current)
- [x] Basic Mahjong solitaire gameplay
- [x] Three difficulty leagues
- [x] Smart contract integration
- [x] Automatic reward distribution
- [x] Local buildnet support

### Phase 2: Enhanced Features (🚧 In Progress)
- [ ] Player profiles and persistent statistics
- [ ] Achievement system and badges
- [ ] Tournament mode with elimination rounds
- [ ] Custom tile themes and board layouts
- [ ] Mobile app (React Native)

### Phase 3: Advanced Gaming (📋 Planned)
- [ ] Multiplayer live matches
- [ ] Seasonal championships
- [ ] NFT collectible tiles
- [ ] Cross-chain compatibility
- [ ] DAO governance for platform decisions

### Phase 4: Ecosystem Expansion (🔮 Future)
- [ ] Third-party game integration
- [ ] Streaming and spectator modes
- [ ] Esports tournaments
- [ ] Gaming guild support
- [ ] Metaverse integration

## 💰 Token Economics & Mainnet Deployment

### Current Challenges

#### Massa Token Acquisition
**The primary challenge for mainnet deployment is obtaining MASSA tokens:**

1. **Limited Exchange Availability**: MASSA is not yet listed on major centralized exchanges
2. **Testnet vs Mainnet**: Current development uses testnet tokens (free from faucet)
3. **Community Distribution**: Tokens mainly distributed through:
   - Community programs
   - Developer grants
   - Early adopter incentives
   - OTC trading in Massa Discord

#### Solutions & Alternatives
- **Buildnet Development**: Continue development on local/test networks
- **Community Engagement**: Participate in Massa ecosystem for token access
- **Grant Applications**: Apply for Massa developer grants
- **Partnership Opportunities**: Collaborate with Massa Labs for token allocation

### Economic Model
- **Platform Revenue**: 10% dev fee from each league
- **Player Incentives**: 90% of entry fees distributed to winners
- **Scalability**: Fees adjust based on network congestion
- **Sustainability**: Revenue funds platform development and maintenance

## Contract Structure

The contract consists of several key components:

### Storage Keys
- `{difficulty}_leagueEnd`: Timestamp when the current league ends
- `{difficulty}_players`: List of players in the current league

### Main Functions

1. **constructor**: Initializes leagues for all difficulties
2. **registerPlayer**: Register a player with their time and difficulty
3. **getLeagueInfo**: Get current league statistics
4. **distributeRewards** (internal): Handles automated reward distribution

## Interacting with the Contract

### Register a Player

```typescript
// Parameters needed:
const time: u64;           // Completion time in seconds
const difficulty: string;  // "easy", "normal", or "hard"
const entryFee: u64;      // 1, 2, or 3 MASSA respectively

// Call the contract
await client.registerPlayer(time, difficulty, { coins: entryFee });
```

### Get League Information

```typescript
// Parameters needed:
const difficulty: string;  // "easy", "normal", or "hard"

// Call the contract
const leagueInfo = await client.getLeagueInfo(difficulty);
```

## League Mechanics

1. **League Duration**: Each league runs for 3 minutes
2. **Entry Requirements**:
   - Players must pay the entry fee for their chosen difficulty
   - Time must be recorded in seconds

3. **Reward Distribution**:
   - Occurs automatically when league ends
   - Top 10% of players share 90% of the pool
   - Dev fee of 10% is collected
   - New league starts immediately after distribution

## Events

The contract emits events for:
- Player registrations
- League endings
- Reward distributions
- Dev fee collections

## Error Handling

The contract includes various safeguards:
- Difficulty validation
- Entry fee verification
- League timing checks
- Player data validation

## Security Features

- Constructor can only be called during deployment
- Entry fees are verified before registration
- All player data is validated before storage
- Automatic reward distribution prevents manipulation

## Deploy a smart contract

Prerequisites :

- You must add a `.env` file at the root of the repository with the following keys set to valid values :
  - WALLET_SECRET_KEY="wallet_secret_key"
  - JSON_RPC_URL_PUBLIC=<https://test.massa.net/api/v2:33035>

These keys will be the ones used by the deployer script to interact with the blockchain.

The following command will build contracts in `assembly/contracts` directory and execute the deployment script
`src/deploy.ts`. This script will deploy on the node specified in the `.env` file.

```shell
npm run deploy
```

You can modify `src/deploy.ts` to change the smart contract being deployed, and to pass arguments to the constructor
function:

- line 31: specify what contract you want to deploy
- line 33: create the `Args` object to pass to the constructor of the contract you want to deploy

When the deployment operation is executed on-chain, the
[constructor](https://github.com/massalabs/massa-sc-toolkit/blob/main/packages/sc-project-initializer/commands/init/assembly/contracts/main.ts#L10)
function of the smart contract being deployed will
be called with the arguments provided in the deployment script.

You can edit this script and use [massa-web3 library](https://www.npmjs.com/package/@massalabs/massa-web3)
to create advanced deployment procedure.

For more information, please visit our ReadTheDocs about
[Massa smart-contract development](https://docs.massa.net/en/latest/web3-dev/smart-contracts.html).

## 🧪 Development & Testing

### Local Development
```bash
# Run contract tests
npm run test

# Format code
npm run fmt

# Lint frontend
cd frontend && npm run lint
```

### Smart Contract Testing
The contract includes comprehensive unit tests in [`assembly/__tests__/`](assembly/__tests__/) covering:
- League initialization
- Player registration
- Reward distribution
- Edge cases and error handling

## 🏗️ Project Structure

```
Mahjong/
├── assembly/                 # Smart contract code
│   ├── contracts/
│   │   └── main.ts          # Main contract logic
│   └── __tests__/           # Contract unit tests
├── frontend/                # Next.js frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks (Massa integration)
│   │   ├── config/          # Blockchain configuration
│   │   └── types/           # TypeScript definitions
│   └── public/              # Static assets
├── src/                     # Deployment scripts
│   ├── deploy.ts           # Contract deployment
│   └── config.ts           # Configuration
└── docs/                   # Documentation
```

## 🔒 Security & Audits

- **Smart Contract**: Automated testing with edge case coverage
- **Frontend**: Input validation and secure wallet integration
- **Audit Status**: Internal testing (external audit planned for mainnet)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Areas
- 🎮 Game mechanics and UI/UX improvements
- 🔗 Blockchain integration optimizations  
- 🧪 Testing and quality assurance
- 📱 Mobile responsiveness
- 🌐 Internationalization
- 📊 Analytics and monitoring

## 📞 Support & Community

- **Discord**: [Join Massa Discord](https://discord.gg/massa)
- **Documentation**: [Massa Docs](https://docs.massa.net/)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Updates**: Follow development progress in our repository

## Unit tests

The test framework documentation is available here: [as-pect docs](https://as-pect.gitbook.io/as-pect)

```shell
npm run test
```

## Format code

```shell
npm run fmt
```

---

**🎮 Ready to compete? Join the Mahjong League and test your skills on the blockchain! 🀄**

*Built with ❤️ on Massa blockchain*

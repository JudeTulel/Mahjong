# Mahjong League Smart Contract

Welcome to the Mahjong League Smart Contract! This decentralized application (dApp) powers an autonomous Mahjong gaming league on the Massa blockchain, featuring multiple difficulty levels, automatic rewards distribution, and self-running leagues.

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

## Prerequisites

Before you start, you'll need:

- Node.js and npm (v18 or later recommended)
- A funded Massa wallet and your secret key
- Basic understanding of AssemblyScript and Massa blockchain

## Building and Deploying

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

## Unit tests

The test framework documentation is available here: [as-pect docs](https://as-pect.gitbook.io/as-pect)

```shell
npm run test
```

## Format code

```shell
npm run fmt
```

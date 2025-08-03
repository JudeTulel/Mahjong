import { Args, stringToBytes } from '@massalabs/as-types';
import { Context, Storage, generateEvent, transferCoins, Address } from '@massalabs/massa-as-sdk';

// Constants for entry fees in nanoMassa (1 MASSA = 1_000_000_000 nanoMASSA)
const EASY_FEE: u64 = 1_000_000_000;   // 1 MASSA
const NORMAL_FEE: u64 = 2_000_000_000; // 2 MASSA
const HARD_FEE: u64 = 3_000_000_000;   // 3 MASSA
const LEAGUE_DURATION: u64 = 180_000;   // 3 minutes (ms)
const DEV_FEE_PERCENT: u64 = 10;        // 10% fee

// Player data structure
class Player {
  constructor(
    public address: string,
    public time: u64,
    public difficulty: string
  ) {}
}

// Get entry fee for difficulty level
function getEntryFee(difficulty: string): u64 {
  if (difficulty == 'easy') return EASY_FEE;
  if (difficulty == 'normal') return NORMAL_FEE;
  if (difficulty == 'hard') return HARD_FEE;
  return 0;
}

// Check if difficulty is valid
function isValidDifficulty(difficulty: string): boolean {
  return difficulty == 'easy' || difficulty == 'normal' || difficulty == 'hard';
}

// Serialize players array to string
function serializePlayers(players: Player[]): string {
  let result = "[";
  for (let i = 0; i < players.length; i++) {
    if (i > 0) result += ",";
    result += '{';
    result += '"address":"' + players[i].address + '",';
    result += '"time":"' + players[i].time.toString() + '",';
    result += '"difficulty":"' + players[i].difficulty + '"';
    result += '}';
  }
  result += "]";
  return result;
}

// Parse player data from string
function deserializePlayers(data: string): Player[] {
  const players: Player[] = [];
  if (data == "[]") return players;

  let items = data.slice(1, -1).split("},");
  for (let i = 0; i < items.length; i++) {
    const item = items[i].replace("{", "").replace("}", "").trim();
    const parts = item.split(",");
    
    let address = "";
    let time: u64 = 0;
    let difficulty = "";
    
    for (let j = 0; j < parts.length; j++) {
      const part = parts[j].trim();
      if (part.startsWith('"address"')) {
        address = part.split(":")[1].replace('"', "").replace('"', "").trim();
      } else if (part.startsWith('"time"')) {
        time = U64.parseInt(part.split(":")[1].replace('"', "").replace('"', "").trim());
      } else if (part.startsWith('"difficulty"')) {
        difficulty = part.split(":")[1].replace('"', "").replace('"', "").trim();
      }
    }
    
    if (address != "" && time > 0 && difficulty != "") {
      players.push(new Player(address, time, difficulty));
    }
  }
  return players;
}

/**
 * Initialize leagues for all difficulties
 */
export function constructor(binaryArgs: StaticArray<u8>): void {
  assert(Context.isDeployingContract(), "Can only be called during deployment");
  
  const difficulties = ['easy', 'normal', 'hard'];
  for (let i = 0; i < difficulties.length; i++) {
    Storage.set(difficulties[i] + "_leagueEnd", Context.timestamp().toString());
    Storage.set(difficulties[i] + "_players", "[]");
  }
  generateEvent("Mahjong League Contract initialized");
}

/**
 * Register a player with their time and difficulty
 */
export function registerPlayer(binaryArgs: StaticArray<u8>): void {
  const args = new Args(binaryArgs);
  const time = args.nextU64().expect("Time argument missing");
  const difficulty = args.nextString().expect("Difficulty argument missing");

  assert(isValidDifficulty(difficulty), "Invalid difficulty (use easy/normal/hard)");
  const entryFee = getEntryFee(difficulty);
  assert(Context.transferredCoins() >= entryFee, "Insufficient fee");

  const leagueEndKey = difficulty + "_leagueEnd";
  const playersKey = difficulty + "_players";
  
  const leagueEnd = U64.parseInt(Storage.get(leagueEndKey));
  let players = deserializePlayers(Storage.get(playersKey));

  players.push(new Player(Context.caller().toString(), time, difficulty));
  Storage.set(playersKey, serializePlayers(players));

  if (Context.timestamp() >= leagueEnd) {
    distributeRewards(difficulty, players);
    Storage.set(leagueEndKey, (Context.timestamp() + LEAGUE_DURATION).toString());
    Storage.set(playersKey, "[]");
  }

  generateEvent(`Player ${Context.caller().toString()} registered for ${difficulty} (time: ${time}s)`);
}

// Distribute rewards for a specific difficulty
function distributeRewards(difficulty: string, players: Player[]): void {
  if (players.length == 0) {
    generateEvent(`${difficulty} league ended with no players`);
    return;
  }

  const entryFee = getEntryFee(difficulty);
  // Sort players by time (ascending)
  players.sort((a: Player, b: Player) => i32(a.time < b.time ? -1 : 1));

  const top10Percent = max(1, players.length * 10 / 100);
  const totalPool = entryFee * players.length;
  const devFee = totalPool * DEV_FEE_PERCENT / 100;
  const rewardPerWinner = (totalPool - devFee) / top10Percent;

  for (let i = 0; i < top10Percent; i++) {
    const winner = players[i];
    const winnerAddress = new Address(winner.address);
    transferCoins(winnerAddress, rewardPerWinner);
    generateEvent(`[${difficulty}] Winner: ${winner.address} won ${rewardPerWinner} nanoMASSA`);
  }

  transferCoins(Context.callee(), devFee);
  generateEvent(`[${difficulty}] Dev fee: ${devFee} nanoMASSA`);
}

/**
 * Get league info
 */
export function getLeagueInfo(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  const args = new Args(binaryArgs);
  const difficulty = args.nextString().expect("Difficulty argument missing");
  assert(isValidDifficulty(difficulty), "Invalid difficulty");

  const leagueEndKey = difficulty + "_leagueEnd";
  const playersKey = difficulty + "_players";
  
  const info = '{' +
    '"difficulty":"' + difficulty + '",' +
    '"entryFee":"' + getEntryFee(difficulty).toString() + ' nanoMASSA",' +
    '"nextEnd":"' + Storage.get(leagueEndKey) + '",' +
    '"playerCount":"' + deserializePlayers(Storage.get(playersKey)).length.toString() + '"' +
  '}';

  return stringToBytes(info);
}

type ECMAScriptTimestamp = number;

interface PlayerRecord {
  fish: string;
  smallestWeight: number;
  smallestDate: ECMAScriptTimestamp;
  biggestWeight: number;
  biggestDate: ECMAScriptTimestamp;
}

interface Player {
  inventory: string[];
  history: PlayerRecord[];
  lifetime: number;
  lifetimeWeight: number;
  canFishDate: ECMAScriptTimestamp;
}

function save(player: Player) {
  customData.set('gofishgame', player as Player & { [key: string]: any });
}

function load(): Player {
  return Object.assign(
    { inventory: [], history: [], lifetime: 0, lifetimeWeight: 0.0, canFishDate: 0 },
    customData.get('gofishgame')
  );
}

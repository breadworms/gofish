type ECMAScriptTimestamp = number;

type PlayerRecord = {
  fish: string;
  smallestWeight: number;
  smallestDate: ECMAScriptTimestamp;
  biggestWeight: number;
  biggestDate: ECMAScriptTimestamp;
};

type Player = {
  inventory: string[];
  history: PlayerRecord[];
  lifetime: number;
  lifetimeWeight: number;
  canFishDate: ECMAScriptTimestamp;
};

function save(player: Player): void {
  customData.set('gofishgame', player as Player & { [key: string]: any });
}

function load(): Player {
  const player = Object.assign(
    { inventory: [], history: [], lifetime: 0, lifetimeWeight: 0.0, canFishDate: 0 },
    customData.get('gofishgame')
  );

  if (player.canFishDate > 0 && player.canFishDate < 1670887583316) {
    migrate(player);
  }

  return player;
}

function migrate(player: Player) {
  const reset = ['🗡️', '🦂', '🦭', '🐧', '🧭', '👑', '🧜‍♀️'];

  player.history = player.history.filter(
    record => !reset.includes(record.fish)
  );

  player.inventory = player.inventory.filter(
    fish => !reset.includes(fish)
  );

  player.canFishDate = Date.now();
}

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
  player.history = player.history.filter(
    record => [
      '🌿',
      '🧦',
      '🐸',
      '🦀',
      '🐚',
      '🐟',
      '💀'
    ].includes(record.fish)
  );

  player.inventory = player.inventory.filter(
    fish => [
      '🧦'
    ].includes(fish)
  );

  const candies = Math.floor(player.lifetime * 0.02);

  for (let i = 0; i < candies) {
    player.inventory.push('🍬');
  }

  player.canFishDate = -1;
}

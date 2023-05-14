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
  week: string;
  channels: Record<string, {
    weekly: number;
    weeklyWeight: number;
    weeklyBiggest: number;
  }>;
  canFishDate: ECMAScriptTimestamp;
}

function save(player: Player | null): void {
  customData.set('gofishgame', player as Player & Record<string, SupibotStoreValue>);
}

function load(): Player {
  return Object.assign(
    {
      inventory: [],
      history: [],
      lifetime: 0,
      lifetimeWeight: 0.0,
      week: '',
      channels: {},
      canFishDate: 0
    },
    customData.get('gofishgame')
  );
}

function find(player: Player, fish: string) {
  return player.history.find(r => r.fish === fish.replace('*', ''));
}

function id(): string {
  let hash = 0x137560f155;

  for (let i = 0; i < executor.length; i++) {
    hash = Math.imul(hash ^ executor.charCodeAt(i), 2654435761);
  }

  return ((hash ^ hash >>> 16) >>> 0).toString();
}

function weekId(): string {
  const lastSaturday = new Date();

  lastSaturday.setDate(lastSaturday.getDate() - lastSaturday.getDay() - 1);

  return lastSaturday.toDateString();
}

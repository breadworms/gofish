async function backup(): Promise<string> {
  const player = load();

  let encoded = `${player.lifetime},${player.lifetimeWeight},${executor},${Date.now()},${player.inventory.length},`;
  encoded += player.inventory
    .map(fish => FISH_TYPES.indexOf(fish))
    .join(',');
  encoded += `,${player.history.length},`;
  encoded += player.history
    .map(record => `${FISH_TYPES.indexOf(record.fish)},${record.smallestDate},${record.smallestWeight},${record.biggestDate},${record.biggestWeight}`)
    .join(',');
  encoded = Buffer.from(encoded).toString('base64');

  const paste = `Your code is below. Keep it somewhere safe, and, should anything happen to your data, you can contact breadworms to get it back.\n\nTHIS URL IS TEMPORARY. COPY THE CODE, NOT THE URL.\n\n${encoded}`;

  return command.execute('hbp', paste).then(res => {
    if (!res.success) {
      throw new Error(`Couldn't back up your data: ${res.reason}`);
    }

    return `Your code is ready: ${res.reply}`;
  });
}

async function main(playerArgs: string): Promise<string> {
  const [cmd, arg] = playerArgs.split(':');

  switch (cmd) {
    case 'backupall':
      if (arg === 'yes') {
        return backup();
      }

      return `This will back up your data in case of a calamity. Use \`backupall yes\` to receive a code with instructions on how to use it.`

    case 'deleteeverything':
      if (arg === 'yes') {
        save(null);

        return `All data was wiped!`;
      }

      return `This will reset all of your data, including *history, records and collection*. Use \`deleteeverything yes\` if you wish to proceed.`;

    default:
      return `Tools for GO FISH GAME. Commands: \`backupall\`, \`deleteeverything\`.`;
  }
}

const FISH_TYPES: readonly string[] = [
  '🌿', '🧦', '🪝', '🐸', '🕷️', '🐍', '🎏', '🐚', '🐠', '🪸', '🐡', '🦀', '🐟',
  '🗡️', '🐬', '🐙', '🐋', '💀', '🪳', '🦐', '🐢', '🦑', '🐌', '🦪', '🐊', '🦕',
  '🐉', '🦞', '🧽', '🦈', '🐳', '🥒', '🧜‍♀️', '👑', '🪱', '🪶', '🩰', '☂️', '🪵',
  '👒', '🦆', '🥪', '🧟', '👟', '🦎', '🦦', '🦠', '🧞‍♂️', '🍄', '🧤', '👢', '🧊',
  '🦭', '🪨', '🧸', '🧣', '⛸️', '🐧', '🧭', '🐻‍❄️', '🍬', '🎰', '🐸*', '🐚*', '🐟*'
];

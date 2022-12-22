function compareSanitized(emoji1: string, emoji2: string): boolean {
  const re = /[\ufe0f\u200d\u{e0002}]/gu;

  return emoji1.replace(re, '') === emoji2.replace(re, '');
}

function printRecord(fish: string): string {
  const record = load().history.find(r => compareSanitized(r.fish, fish));

  if (record === undefined) {
    return `You've never caught a ${fish}!`;
  }

  switch (record.fish) {
    case '🎏':
      return `An aerodynamic lure. Increases the range of your line. Used automatically.`;

    case '🪝':
      return `A heavy hook. Allows for fishing in the depths of the ocean. Used automatically.`;

    case '🍬':
      return `A delicious candy. Packed with sugar, eating a piece makes one ready for anything. Release to use.`;

    case '🎰':
      return `A one-armed bandit. You can't resist its allure. It has ${Math.ceil(record.biggestWeight)} spins left.`;

    case '🗡️':
      return `Davy Joneseg's dagger. Being you found it lodged in the remains of his ribcage suggests he was done in by his own dagger.`;

    case '👑':
      return `Davy Joneseg's booty. Screw fishing, you're rich!`;

    case '🧭':
      return `Davy Joneseg's magic compass. No one knows where or what it points to, but it sure seems to go crazy around chicken farms!`;

    default:
      return `Caught ${(new Date(record.biggestDate)).toDateString()}: ${record.fish} ${record.biggestWeight} lbs. Caught ${(new Date(record.smallestDate)).toDateString()}: ${record.fish} ${record.smallestWeight} lbs.`;
  }
}

function main(playerArgs: string): string {
  const [cmd, arg] = playerArgs.split(':');

  // Maybe make a separate alias for sub commands, like
  // `$$ gofishtools`. Would reduce lines of code for what is 99% of
  // usage.

  switch (cmd) {
    case 'release': {
      if (!arg) {
        return `No fish to release... (\`release <fish>\`)`;
      }

      const player = load();
      const index = player.inventory.findLastIndex(fish => compareSanitized(fish, arg));

      if (index === -1) {
        return `No fish to release... (No ${arg} found in inventory)`;
      }

      return release(player, index);
    }

    case 'collection':
    case 'show':
      if (arg) {
        return printRecord(arg);
      }

      return `Your collection: ${load().inventory.join(' ')}`;

    case 'record': {
      if (arg) {
        return printRecord(arg);
      }

      const player = load();

      if (!player.history.length) {
        return `You haven't caught anything.`;
      }

      const record = player.history.reduce((a, b) => a.biggestWeight > b.biggestWeight ? a : b);

      return `${record.fish} ${record.biggestWeight} lbs! Wow! 📸 Overall, you've caught ${player.lifetime} fish weighing at ${Math.round(player.lifetimeWeight * 100) / 100} lbs. You've seen ${player.history.length}/61 types of fish.`;
    }

    case 'treasure':
      return `Rumor has it that legendary pirate Davy Joneseg's treasure still lies somewhere on the ocean floor. Can you find all his treasures?`;

    case 'weather': {
      const player = load();
      const today = forecast(player, new Date());
      const later = forecast(player, new Date(Date.now() + 21600000));

      if (today.ambiance === later.ambiance) {
        return `${today.reports().continuous}`;
      }

      return `${today.reports().current} ${later.reports().impending}`;
    }

    case '?':
    case 'help':
      if (arg) {
        return printRecord(arg);
      }

      return `Commands: \`? <fish>\`, \`release <fish>\`, \`record\`, \`collection\`, \`weather\`, \`treasure\`, \`deleteeverything\`.`;

    case 'deleteeverything':
      if (arg === 'yes') {
        save(null);

        return `All data was wiped!`;
      }

      return `This will reset all of your data, including *history, records and collection*. Use \`deleteeverything yes\` if you wish to proceed.`;

    default:
      return play();
  }
}

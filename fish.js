/* * * * * * * * * * * *
 *
 *   GO FISH GAME
 *     by breadworms,
 *    inspired by `fish` by futurecreep
 *    and `kirbyFishing` by 2547techno
 *
 *    Let's go fish!
 *
 * * * * * * * * * * */

class Ocean {
  constructor(width, height, ambiance, map) {
    this.width = width;
    this.height = height;
    this.ambiance = ambiance;
    this.map = map;
  }

  random(long, deep) {
    // Hardcoded: `10` max for short/shallow, `1` min offset for long/deep.
    const distance = Math.floor(Math.random() * (long ? this.width - 1 : 10)) + (long ? 1 : 0);
    const depth = Math.floor(Math.random() * (deep ? this.height - 1 : 10)) + (deep ? 1 : 0);
    const coord = depth * this.width + distance;

    if (this.map[coord] === '🟦') {
      return [false, 0.0];
    }

    return [
      this.map[coord],
      Math.round(Math.random() * (distance + 1) * (depth + 1) * 100) / 100
    ];
  }
}

function updateRecord(history, fish, weight) {
  const record = history.find(r => r.fish === fish);

  if (record === undefined) {
    history.push({
      fish: fish,
      smallestWeight: weight,
      smallestDate: Date.now(),
      biggestWeight: weight,
      biggestDate: Date.now()
    });

    return;
  }

  if (record.smallestWeight > weight) {
    record.smallestWeight = weight;
    record.smallestDate = Date.now();
  }

  if (record.biggestWeight < weight) {
    record.biggestWeight = weight;
    record.biggestDate = Date.now();
  }
}

function makeGear(inventory, gear) {
  const index = inventory.indexOf(gear);

  if (index === -1) {
    return [false, () => false];
  }

  return [
    true,
    weight => Math.random() * 100 < weight / 2 && inventory.splice(inventory.indexOf(gear), 1)
  ];
}

function fish(ocean) {
  const now = Date.now();
  const player = load();
  const canFish = new Date(player.canFishDate) - now;

  if (canFish > 0) {
    return `Ready to fish in ${canFish < 60000 ? Math.ceil(canFish / 1000) + 's' : Math.ceil(canFish / 1000 / 60) + 'm'}`;
  }

  const [hasLure, useLure] = makeGear(player.inventory, '🎏');
  const [hasHook, useHook] = makeGear(player.inventory, '🪝');

  const [fish, weight] = ocean.random(hasLure, hasHook);

  if (fish === false) {
    player.canFishDate = now + 30000;
    save(player);

    return `${ocean.ambiance} (30s cooldown)`;
  }

  let resp = `You caught a ✨ ${fish} ✨! It weighs ${weight} lbs.`;

  player.inventory.push(fish);
  updateRecord(player.history, fish, weight);

  const hasPirateSet = player.inventory.includes('🗡️')
    && player.inventory.includes('👑')
    && player.inventory.includes('🧭');

  if (hasPirateSet && hasLure && hasHook) {
    const [eatenFish, eatenWeight] = ocean.fish(true, true);

    if (eatenFish !== false && eatenWeight < weight) {
      player.inventory.push(eatenFish);
      updateRecord(player.history, eatenFish, eatenWeight);

      resp += ` And!... ${eatenFish} (${eatenWeight} lbs) was in its mouth!`;
    }
  }

  resp += (useLure(weight) ? ' 🎏 broke!💢' : '')
    + (useHook(weight) ? ' 🪝 broke!💢' : '')
    + ' (30m cooldown after a catch)';

  player.canFishDate = now + 1800000;

  save(player);

  return resp;
}

function printRecord(fish) {
  const record = load().history.find(r => r.fish === fish.trim());

  if (record === undefined) {
    return `You've never caught a ${fish}!`;
  }

  switch (record.fish) {
    case '🎏':
      return `An aerodynamic lure. Increases the range of your line. Used automatically.`;

    case '🪝':
      return `A heavy hook. Allows for fishing in the depths of the ocean. Used automatically.`;

    case '🗡️':
      return `Davy Jonseg's dagger. Being you found it lodged in the remains of his ribcage suggests he was done in by his own dagger.`;

    case '👑':
      return `Davy Jonseg's booty. Screw fishing, you're rich!`;

    case '🧭':
      return `Davy Jonseg's magic compass. No one knows where or what it points to, but it sure seems to go crazy around chicken farms!`;

    default:
      return `Caught ${(new Date(record.biggestDate)).toDateString()}: ${record.fish} ${record.biggestWeight} lbs.`
        + ` Caught ${(new Date(record.smallestDate)).toDateString()}: ${record.fish} ${record.smallestWeight} lbs.`;
  }
}

function main(playerArgs, weatherArg) {
  const [cmd, arg] = playerArgs.split(':');
  const weather = weatherArg.trim();

  // Maybe make a separate alias for sub commands, like
  // `$$ gofishtools`. Would reduce lines of code for what is 99% of
  // usage.

  switch (cmd) {
    case 'release':
      if (!arg) {
        return `No fish to release... (\`release <fish>\`)`;
      }

      const player = load();
      const index = player.inventory.lastIndexOf(arg);

      if (index === -1) {
        return `No fish to release... (No ${arg} found in inventory)`;
      }

      player.inventory.splice(index, 1);
      save(player);

      return `Bye bye ${arg}! 🫳🌊`;

    case 'collection':
    case 'show':
      if (!arg) {
        const player = load();

        return `Your collection: ${player.inventory.join(' ')}`;
      }

      return printRecord(arg);

    case 'record':
      if (arg) {
        return printRecord(arg);
      }

      const history = load().history;

      if (!history.length) {
        return `You haven't caught anything.`;
      }

      const record = history.reduce((a, b) => a.biggestWeight > b.biggestWeight ? a : b);

      return `${record.fish} ${record.biggestWeight} lbs! Wow! 📸🎉`;

    case 'treasure':
      return `Rumor has it that legendary pirate Davy Jonseg's treasure still lies somewhere on the ocean floor. Can you find all his treasures?`;

    case '?':
    case 'help':
      if (arg) {
        return printRecord(arg);
      }

      return `Commands: \`? <fish>\`, \`release <fish>\`, \`collection\`, \`treasure\`, \`deleteeverything\`.`;

    case 'deleteeverything':
      if (arg === 'yes') {
        customData.set('gofishgame');

        return `All data was wiped!`;
      }

      return `This will reset all of your data, including *history, records and collection*. Use \`deleteeverything yes\` if you wish to proceed.`;

    default:
      if (['🌧', '⛈', '🌪'].includes(weather)) {
        return fish(rainyOcean);
      } else if (weather === '🌨') {
        return fish(icyOcean);
      }

      return fish(normalOcean);
  }
}

function save(player) {
  customData.set('gofishgame', JSON.stringify(player));
}

function load() {
  return Object.assign(
    { inventory: [], history: [], canFishDate: Date.now() },
    JSON.parse(customData.get('gofishgame') ?? null)
  );
}

const normalOcean = new Ocean(20, 20, 'Nothing...', [
  // 1    2     3     4     5       6     7     8      9     10     11    12    13     14    15     16    17     18    19     20
  '🌿', '🧦', '🪝', '🪝', '🐸', '🟦', '🟦', '🟦', '🟦', '🟦', '🕷️', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐍', // 1
  '🎏', '🐚', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐠', '🪸', '🐡', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 2
  '🦀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 3
  '🎏', '🟦', '🟦', '🐟', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🗡️', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 4
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 5
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 6
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐬', '🟦', '🟦', '🟦', '🟦', '🐙', '🟦', // 7
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 8
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐋', '🟦', '🟦', '🟦', '🟦', // 9
  '💀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 10
  '🐌', '🟦', '🦐', '🟦', '🟦', '🟦', '🐢', '🦑', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 11
  '🦂', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 12
  '🟦', '🟦', '🦪', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 13
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 14
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐊', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦕', '🟦', '🟦', // 15
  '🟦', '🟦', '🟦', '🦞', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 16
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 17
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦈', '🟦', '🟦', '🟦', '🟦', '🐉', '🟦', '🟦', '🟦', // 18
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐳', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 19
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦' // 20
]);

const rainyOcean = new Ocean(20, 20, '🌧 It rains...', [
  // 1    2     3     4     5       6     7     8      9     10     11    12    13     14    15     16    17     18    19     20
  '🌿', '🧦', '🪝', '🪝', '🟦', '🟦', '🟦', '🟦', '🐸', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐍', // 1
  '🎏', '🐚', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐠', '🪸', '🐡', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 2
  '🎏', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🕷️', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 3
  '🟦', '🟦', '🟦', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 4
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐬', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 5
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 6
  '🦀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐋', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 7
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 8
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 9
  '💀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐙', // 10
  '🟦', '🟦', '🟦', '🐢', '🟦', '🟦', '🟦', '🦑', '🟦', '🟦', '🧜‍♀️', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 11
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐊', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 12
  '🟦', '🟦', '🦪', '🟦', '🟦', '👑', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 13
  '🟦', '🟦', '🟦', '🟦', '🦐', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 14
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦕', '🟦', '🟦', // 15
  '🐌', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 16
  '🦂', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 17
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦈', '🟦', '🟦', '🟦', '🟦', '🐉', '🟦', '🟦', '🟦', // 18
  '🟦', '🟦', '🟦', '🟦', '🦞', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐳', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 19
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦' // 20
]);

const icyOcean = new Ocean(10, 40, '🌨 It\'s cold...', [
  // 1    2     3     4     5       6    7     8      9      10
  '🧣', '⛸️', '🪝', '🪝', '🐸', '🟦', '🟦', '🟦', '🟦', '🟦', // 1
  '🪝', '🐚', '🟦', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 2
  '🦀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐧', // 3
  '🪝', '🟦', '🟦', '🟦', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', // 4
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 5
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 6
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 7
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 8
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 9
  '💀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 10
  '🐌', '🧭', '🦐', '🟦', '🟦', '🟦', '🐢', '🟦', '🟦', '🟦', // 11
  '🦂', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 12
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 13
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 14
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐊', // 15
  '🟦', '🟦', '🟦', '🦞', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 16
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 17
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 18
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦪', '🟦', '🟦', '🟦', // 19
  '🐍', '🟦', '🟦', '🟦', '🐬', '🟦', '🟦', '🟦', '🟦', '🟦', // 20
  '🟦', '🟦', '🟦', '🟦', '🟦', '🐋', '🟦', '🟦', '🟦', '🟦', // 21
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 22
  '🟦', '🟦', '🟦', '🦭', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 23
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐳', '🟦', // 24
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 25
  '🟦', '🐙', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 26
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 27
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 28
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 29
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 30
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦈', // 31
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 32
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 33
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 34
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 35
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 36
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 37
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 38
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦑', '🟦', '🟦', // 39
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦' // 40
]);

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

function updateRecord(player, fish, weight) {
  const record = player.history.find(r => r.fish === fish);

  player.lifetime += 1;
  player.lifetimeWeight += weight;

  if (record === undefined) {
    player.history.push({
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

function fish() {
  const player = load();
  const date = new Date();
  const now = date.getTime();
  const ocean = weatherForecast?.[date.getMonth() + 1]?.[date.getDate()] ?? normalOcean;

  if (player.canFishDate === 0) {
    player.canFishDate = now;
    save(player);

    return `You caught a 🗞🍾 message in a bottle! 📜 "Welcome to GO FISH GAME! Use \`help\` if you need more information. Let's go fish! -Swormbeard"`;
  } else if (player.inventory.length >= 200) {
    return `Inventory full 🎒🗯️! Release some fish with \`release\` to continue! Records won't get removed.`;
  }

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

  const biggest = player.history.reduce(
    (a, r) => a > r.biggestWeight ? a : r.biggestWeight,
    0.0
  );

  if (Math.random() * 100 < weight - 50 - biggest) {
    player.canFishDate = now + 30000;
    save(player);

    return `The one that got away... ${fish} was too big to land!`;
  }

  let resp = `You caught a ✨ ${fish} ✨! It weighs ${weight} lbs.`;

  player.inventory.push(fish);
  updateRecord(player, fish, weight);

  const hasPirateSet = player.inventory.includes('🗡️')
    && player.inventory.includes('👑')
    && player.inventory.includes('🧭');

  if (hasPirateSet && hasLure && hasHook) {
    const [eatenFish, eatenWeight] = ocean.random(true, true);

    if (eatenFish !== false && eatenWeight < weight) {
      player.inventory.push(eatenFish);
      updateRecord(player, eatenFish, eatenWeight);

      resp += ` And!... ${eatenFish} (${eatenWeight} lbs) was in its mouth!`;
    }
  }

  resp += (useLure(weight) ? ' 🎏 broke!💢' : '')
    + (useHook(weight) ? ' 🪝 broke!💢' : '')
    + (weight > biggest ? ' A new record! 🎉' : '')
    + ' (30m cooldown after a catch)';

  player.canFishDate = now + 1800000;

  save(player);

  return resp;
}

function printRecord(fish) {
  const record = load().history.find(r => r.fish.replace('\ufe0f', '') === fish.replace(/[\s\ufe0f]/g, ''));

  if (record === undefined) {
    return `You've never caught a ${fish}!`;
  }

  switch (record.fish) {
    case '🎏':
      return `An aerodynamic lure. Increases the range of your line. Used automatically.`;

    case '🪝':
      return `A heavy hook. Allows for fishing in the depths of the ocean. Used automatically.`;

    case '🗡️':
      return `Davy Joneseg's dagger. Being you found it lodged in the remains of his ribcage suggests he was done in by his own dagger.`;

    case '👑':
      return `Davy Joneseg's booty. Screw fishing, you're rich!`;

    case '🧭':
      return `Davy Joneseg's magic compass. No one knows where or what it points to, but it sure seems to go crazy around chicken farms!`;

    default:
      return `Caught ${(new Date(record.biggestDate)).toDateString()}: ${record.fish} ${record.biggestWeight} lbs.`
        + ` Caught ${(new Date(record.smallestDate)).toDateString()}: ${record.fish} ${record.smallestWeight} lbs.`;
  }
}

function main(playerArgs) {
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
      const index = player.inventory.lastIndexOf(arg);

      if (index === -1) {
        return `No fish to release... (No ${arg} found in inventory)`;
      }

      player.inventory.splice(index, 1);
      save(player);

      return `Bye bye ${arg}! 🫳🌊`;
    }

    case 'collection':
    case 'show':
      if (!arg) {
        const player = load();

        return `Your collection: ${player.inventory.join(' ')}`;
      }

      return printRecord(arg);

    case 'record': {
      if (arg) {
        return printRecord(arg);
      }

      const player = load();

      if (!player.history.length) {
        return `You haven't caught anything.`;
      }

      const record = player.history.reduce((a, b) => a.biggestWeight > b.biggestWeight ? a : b);

      return `${record.fish} ${record.biggestWeight} lbs! Wow! 📸 Overall, you've caught ${player.lifetime} fish weighing at ${Math.round(player.lifetimeWeight * 100) / 100} lbs.`;
    }

    case 'treasure':
      return `Rumor has it that legendary pirate Davy Joneseg's treasure still lies somewhere on the ocean floor. Can you find all his treasures?`;

    case '?':
    case 'help':
      if (arg) {
        return printRecord(arg);
      }

      return `Commands: \`? <fish>\`, \`release <fish>\`, \`record\`, \`collection\`, \`treasure\`, \`deleteeverything\`.`;

    case 'deleteeverything':
      if (arg === 'yes') {
        customData.set('gofishgame');

        return `All data was wiped!`;
      }

      return `This will reset all of your data, including *history, records and collection*. Use \`deleteeverything yes\` if you wish to proceed.`;

    default:
      return fish();
  }
}

function save(player) {
  customData.set('gofishgame', player);
}

function load() {
  const data = customData.get('gofishgame');

  // Temporary, will remove after 1-2 days.
  if (typeof data === 'string') {
    return migrate(data);
  }

  return Object.assign(
    { inventory: [], history: [], lifetime: 0, lifetimeWeight: 0.0, canFishDate: 0 },
    data
  );
}

function migrate(json) {
  const player = JSON.parse(json);

  let fishInHistory = 0;
  let baseWeight = 0.0;

  player.history.forEach(record => {
    baseWeight += record.biggestWeight;
    fishInHistory += 1;

    if (record.smallestDate !== record.biggestDate) {
      baseWeight += record.smallestWeight;
      fishInHistory += 1;
    }
  });

  let baseLifetime = Math.max(fishInHistory, player.inventory.length);

  // 6 in history, 10 in inventory = 4 weights unaccounted for.
  // Average fish weight is 19.
  baseWeight += (baseLifetime - fishInHistory) * 19.0;

  // Around 10% of catches are lures/hooks which break. Players might
  // have released some, so add a little extra.
  // Their weights aren't tallied because 19 is already a high average.
  baseLifetime *= 1.125;

  player.lifetime = Math.floor(baseLifetime);
  player.lifetimeWeight = baseWeight;

  return player;
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
  '🧽', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦈', '🟦', '🟦', '🟦', '🟦', '🐉', '🟦', '🟦', '🟦', // 18
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 19
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐳', '🟦', '🟦', '🟦', '🟦', '🟦' // 20
]);

const rainyOcean = new Ocean(20, 20, '🌧 It rains...', [
  // 1    2     3     4     5       6     7     8      9     10     11    12    13     14    15     16    17     18    19     20
  '🌿', '🧦', '🪝', '🪝', '🟦', '🟦', '🟦', '🟦', '🐸', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🥒', '🟦', '🟦', '🐍', // 1
  '🎏', '🐚', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐠', '🪸', '🐡', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 2
  '🎏', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🕷️', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 3
  '🟦', '🟦', '🟦', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 4
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐬', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 5
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 6
  '🦀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐋', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 7
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 8
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 9
  '💀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐙', // 10
  '🟦', '🟦', '🟦', '🐢', '🟦', '🟦', '🟦', '🦑', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 11
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐊', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 12
  '🟦', '🟦', '🦪', '🟦', '🟦', '👑', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 13
  '🟦', '🟦', '🟦', '🟦', '🦐', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 14
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦕', '🟦', '🟦', // 15
  '🐌', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 16
  '🦂', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 17
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦈', '🟦', '🟦', '🟦', '🟦', '🐉', '🟦', '🟦', '🟦', // 18
  '🟦', '🟦', '🟦', '🟦', '🦞', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 19
  '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐳', '🟦', '🟦', '🟦', '🟦', '🟦' // 20
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

const weatherForecast = {
  11: {
    30: rainyOcean
  },
  12: {
    1: rainyOcean,
    5: rainyOcean, 6: icyOcean,
    13: rainyOcean, 16: rainyOcean,
    24: icyOcean, 25: icyOcean,
    28: rainyOcean
  }
};

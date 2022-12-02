function random(ocean: GameMap, long: boolean, deep: boolean): { fish: false | string, weight: number } {
  // Hardcoded: `10` max for short/shallow, `1` min offset
  // for long/deep.
  const distance = Math.floor(Math.random() * (long ? ocean.width - 1 : 10)) + (long ? 1 : 0);
  const depth = Math.floor(Math.random() * (deep ? ocean.height - 1 : 10)) + (deep ? 1 : 0);
  const coord = depth * ocean.width + distance;

  if (ocean.map[coord] === '🟦') {
    return { fish: false, weight: 0.0 };
  }

  return {
    fish: ocean.map[coord],
    weight: Math.round(Math.random() * (distance + 1) * (depth + 1) * 100) / 100
  };
}

function updateRecord(player: Player, fish: string, weight: number): void {
  const record = player.history.find(r => r.fish === fish);

  if (record === undefined) {
    player.history.push({
      fish: fish,
      smallestWeight: weight,
      smallestDate: Date.now(),
      biggestWeight: weight,
      biggestDate: Date.now()
    });
  } else {
    if (weight < record.smallestWeight) {
      record.smallestWeight = weight;
      record.smallestDate = Date.now();
    }

    if (weight > record.biggestWeight) {
      record.biggestWeight = weight;
      record.biggestDate = Date.now();
    }
  }

  player.lifetime += 1;
  player.lifetimeWeight += weight;
}

function makeGear(inventory: string[], gear: string): { canUse: boolean, use: (weight: number) => boolean } {
  if (inventory.lastIndexOf(gear) === -1) {
    return { canUse: false, use: () => false };
  }

  return {
    canUse: true,
    use: weight => Math.random() * 100 < weight / 2 && !!inventory.splice(inventory.indexOf(gear), 1)
  };
}

function gofish(): string {
  const player = load();
  const date = new Date();
  const now = date.getTime();

  if (player.canFishDate === 0) {
    player.canFishDate = now;
    save(player);

    return `You caught a 🗞🍾 message in a bottle! 📜 "Welcome to GO FISH GAME! Use \`help\` if you need more information. Let's go fish! -Swormbeard"`;
  } else if (player.inventory.length >= 200) {
    return `Inventory full 🎒🗯️! Release some fish with \`release\` to continue! Records won't get removed.`;
  }

  if (player.canFishDate - now > 0) {
    return `Ready to fish ${utils.timeDelta(player.canFishDate)}`;
  }

  const weatherKey = (date.getMonth() + 1) + '.' + date.getDate();
  const ocean = (
    FORECAST[weatherKey + '.' + date.getHours()]
      ?? FORECAST[weatherKey]
      ?? CALM_OCEAN
  )();

  const lure = makeGear(player.inventory, '🎏');
  const hook = makeGear(player.inventory, '🪝');

  const { fish, weight } = random(ocean, lure.canUse, hook.canUse);

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

  if (hasPirateSet) {
    const { fish: eatenFish, weight: eatenWeight } = random(ocean, true, true);

    if (eatenFish !== false && eatenWeight < weight) {
      player.inventory.push(eatenFish);
      updateRecord(player, eatenFish, eatenWeight);

      resp += ` And!... ${eatenFish} (${eatenWeight} lbs) was in its mouth!`;
    }
  }

  resp += (lure.use(weight) ? ' 🎏 broke!💢' : '')
    + (hook.use(weight) ? ' 🪝 broke!💢' : '')
    + (weight > biggest ? ' A new record! 🎉' : '')
    + ' (30m cooldown after a catch)';

  player.canFishDate = now + 1800000;
  save(player);

  return resp;
}

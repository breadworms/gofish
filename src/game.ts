function getOcean(date: Date): GameMapResolver {
  return FORECAST[`${date.getMonth() + 1}.${date.getDate()}:${TIMEOFDAY[date.getHours()]}`]
    ?? CALM_OCEAN;
}

function getFish(ocean: GameMap, range: number, depth: number): { fish: false | string, weight: number } {
  const fish = ocean.map[depth * ocean.width + range];

  if (fish === '🟦') {
    return { fish: false, weight: 0.0 };
  }

  return {
    fish: typeof fish === 'string' ? fish : fish(),
    weight: Math.round(Math.random() * (range + 1) * (depth + 1) * 100) / 100
  };
}

function addFish(player: Player, fish: string, weight: number): void {
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

  player.inventory.push(fish);
}

function breakGear(inventory: string[], gear: string, weight: number): boolean {
  if (Math.random() * 100 < weight / 2) {
    inventory.splice(inventory.indexOf(gear), 1);

    return true;
  }

  return false;
}

function gofish(): string {
  const player = load();
  const date = new Date();
  const now = date.getTime();

  if (player.canFishDate === 0) {
    player.canFishDate = now;
    save(player);

    return `You caught a 🗞🍾 message in a bottle! 📃 "Welcome to GO FISH GAME! Use \`help\` if you need more information. Let's go fish! -Swormbeard"`;
  } else if (player.inventory.length >= 200) {
    return `Inventory full 🎒🗯️! Release some fish with \`release\` to continue! Records won't get removed.`;
  }

  if (player.canFishDate - now > 0) {
    return `Ready to fish ${utils.timeDelta(player.canFishDate)}`;
  }

  const ocean = getOcean(date)(player);

  let minRange = 0, maxRange = 10;
  let minDepth = 0, maxDepth = 10;

  // Go through player inventory, checking for lures, hooks and
  // slot machines.
  for (let i = player.inventory.length - 1; i > -1; i--) {
    if (player.inventory[i] === '🎏') {
      maxRange = ocean.width - 1;
      minRange = 1;
    } else if (player.inventory[i] === '🪝') {
      maxDepth = ocean.height - 1;
      minDepth = 1;
    }
  }

  const { fish, weight } = getFish(
    ocean,
    Math.floor(Math.random() * maxRange) + minRange,
    Math.floor(Math.random() * maxDepth) + minDepth
  );

  if (fish === false) {
    player.canFishDate = now + 30000;
    save(player);

    return `${ocean.ambiance} (30s cooldown)`;
  }

  let biggest = 0.0;
  let flair = '🫧';

  // Go through player history, checking for previous biggest fish and
  // if it's a new type of fish.
  for (const record of player.history) {
    if (record.biggestWeight > biggest) {
      biggest = record.biggestWeight;
    }

    if (record.fish === fish) {
      flair = '✨';
    }
  }

  // The bigger difference between the caught fish and the player's
  // previous biggest fish, the more likely it is to escape.
  if (Math.random() * 100 < weight - 50 - biggest) {
    player.canFishDate = now + 30000;
    save(player);

    return `The one that got away... ${fish} was too big to land!`;
  }

  addFish(player, fish, weight);

  let resp = `You caught a ${flair} ${fish} ${flair}! It weighs ${weight} lbs.`;

  // Check for pirate set bonus.
  if (
    player.inventory.includes('🗡️')
    && player.inventory.includes('👑')
    && player.inventory.includes('🧭')
  ) {
    const eaten = getFish(
      ocean,
      Math.floor(Math.random() * ocean.width),
      Math.floor(Math.random() * ocean.height)
    );

    if (eaten.fish !== false && eaten.weight < weight) {
      addFish(player, eaten.fish, eaten.weight);

      resp += ` And!... ${eaten.fish} (${eaten.weight} lbs) was in its mouth!`;
    }
  }

  // `min*` being non-zero means gear was found and should be broken.
  resp += (minRange && breakGear(player.inventory, '🎏', weight) ? ' 🎏 broke!💢' : '')
    + (minDepth && breakGear(player.inventory, '🪝', weight) ? ' 🪝 broke!💢' : '')
    + (weight > biggest ? ' A new record! 🎉' : '')
    + ' (30m cooldown after a catch)';

  player.canFishDate = now + 1800000;
  save(player);

  return resp;
}

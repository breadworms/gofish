function getOcean(date: Date): GameMapResolver {
  const weatherKey = (date.getMonth() + 1) + '.' + date.getDate();

  return (FORECAST[weatherKey + ':' + TIMEOFDAY[date.getHours()]]
    ?? FORECAST[weatherKey]
    ?? CALM_OCEAN);
}

function getFish(ocean: GameMap, distance: number, depth: number): { fish: false | string, weight: number } {
  const fish = ocean.map[depth * ocean.width + distance];

  if (fish === false) {
    return { fish, weight: 0.0 };
  }

  return {
    fish: typeof fish === 'string' ? fish : fish(),
    weight: Math.round(Math.random() * (distance + 1) * (depth + 1) * 100) / 100
  };
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

  const lure = makeGear(player.inventory, '🎏');
  const hook = makeGear(player.inventory, '🪝');

  const { fish, weight } = getFish(
    ocean,
    Math.floor(Math.random() * (lure.canUse ? ocean.width - 1 : 10)) + (lure.canUse ? 1 : 0),
    Math.floor(Math.random() * (hook.canUse ? ocean.height - 1 : 10)) + (hook.canUse ? 1 : 0)
  );

  if (fish === false) {
    player.canFishDate = now + 30000;
    save(player);

    return `${ocean.ambiance} (30s cooldown)`;
  }

  let biggest = 0.0;
  let flair = '🫧';

  for (const record of player.history) {
    if (record.biggestWeight > biggest) {
      biggest = record.biggestWeight;
    }

    if (record.fish === fish) {
      flair = '✨';
    }
  }

  if (Math.random() * 100 < weight - 50 - biggest) {
    player.canFishDate = now + 30000;
    save(player);

    return `The one that got away... ${fish} was too big to land!`;
  }

  let resp = `You caught a ${flair} ${fish} ${flair}! It weighs ${weight} lbs.`;

  player.inventory.push(fish);
  updateRecord(player, fish, weight);

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
      player.inventory.push(eaten.fish);
      updateRecord(player, eaten.fish, eaten.weight);

      resp += ` And!... ${eaten.fish} (${eaten.weight} lbs) was in its mouth!`;
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

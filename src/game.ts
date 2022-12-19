function reelIn(
  ocean: GameMap,
  x: number,
  y: number
): {
  fish: false | string,
  weight: number
} {
  const fish = ocean.map[(y - 1) * ocean.width + (x - 1)];

  if (fish === '🟦') {
    return { fish: false, weight: 0.0 };
  }

  return {
    fish: typeof fish === 'string' ? fish : fish(),
    weight: Math.round(Math.random() * x * y * 100) / 100
  };
}

function random(ocean: GameMap) {
  return reelIn(ocean, utils.random(1, ocean.width), utils.random(1, ocean.height));
}

function getOcean(player: Player, date: Date): GameMap {
  return (FORECAST[`${date.getMonth() + 1}.${date.getDate()}:${TIMEOFDAY[date.getHours()]}`]
    ?? CALM_OCEAN)(player);
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

function breakGear(player: Player, gear: string, weight: number): boolean {
  if (Math.random() * 100 < weight / 2) {
    player.inventory.splice(player.inventory.indexOf(gear), 1);

    return true;
  }

  return false;
}

function play(): string {
  const player = load();
  const date = new Date();
  const now = date.getTime();

  if (player.canFishDate === 0) {
    player.canFishDate = now;
    save(player);

    return `You caught a 🗞🍾 message in a bottle! 📃 "Welcome to GO FISH GAME! Use \`help\` if you need more information. Let's go fish! -Swormbeard"`;
  }

  if (player.inventory.length >= 100) {
    return `Inventory full 🎒🗯️! Release some fish with \`release\` to continue! Records won't get removed.`;
  }

  if (player.canFishDate - now > 0) {
    return `Ready to fish ${utils.timeDelta(player.canFishDate)}`;
  }

  let ocean = getOcean(player, date);

  let minRange = 1, maxRange = 10;
  let minDepth = 1, maxDepth = 10;

  // Go through player inventory, checking for lures, hooks and
  // slot machines.
  for (let i = player.inventory.length - 1; i > -1; i--) {
    if (player.inventory[i] === '🎰') {
      // Will never be undefined, should throw error if.
      const slot = player.history.find(r => r.fish === '🎰') as PlayerRecord;

      // A slot machine's biggest weight are the spins remaining.
      if (slot.biggestWeight <= 0) {
        player.inventory.splice(i, 1);

        continue;
      }

      ocean = SLOT_MACHINE(player);
      minRange = 1;
      minDepth = 1;
      maxRange = ocean.width;
      maxDepth = ocean.height;

      slot.biggestWeight -= 1;

      break;

    } else if (player.inventory[i] === '🎏') {
      minRange = 2;
      maxRange = ocean.width;

    } else if (player.inventory[i] === '🪝') {
      minDepth = 2;
      maxDepth = ocean.height;
    }
  }

  const { fish, weight } = reelIn(
    ocean,
    utils.random(minRange, maxRange),
    utils.random(minDepth, maxDepth)
  );

  if (fish === false) {
    player.canFishDate = now + 30000;
    save(player);

    return `${ocean.ambiance} (30s cooldown)`;
  }

  let biggest = 0.0;
  let flair = '🫧';

  // Go through player history, checking for previous biggest fish and
  // if this fish has been caught before.
  for (const record of player.history) {
    if (record.biggestWeight > biggest) {
      biggest = record.biggestWeight;
    }

    if (record.fish === fish) {
      flair = '✨';
    }
  }

  // The bigger difference between this fish and the player's
  // biggest fish, the more likely it is to escape.
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
    const eaten = random(ocean);

    if (eaten.fish !== false && eaten.weight < weight) {
      addFish(player, eaten.fish, eaten.weight);

      resp += ` And!... ${eaten.fish} (${eaten.weight} lbs) was in its mouth!`;
    }
  }

  // `min*` being more than 1 means gear was found and should be broken.
  resp += (minRange > 1 && breakGear(player, '🎏', weight) ? ' 🎏 broke!💢' : '')
    + (minDepth > 1 && breakGear(player, '🪝', weight) ? ' 🪝 broke!💢' : '')
    + (weight > biggest ? ' A new record! 🎉' : '');

  // 8 height is slot machine, skip cooldown.
  if (ocean.height === 8) {
    player.canFishDate = now + 30000;
  } else {
    player.canFishDate = now + 1800000;
    resp += ' (30m cooldown after a catch)';
  }

  save(player);

  return resp;
}

function release(player: Player, index: number): string {
  const fish = player.inventory[index];

  player.inventory.splice(index, 1);

  if (fish === '🍬') {
    let resp = `Delicious! 🫳🗑️`;

    const bonus = random(getOcean(player, new Date()));

    if (bonus.fish !== false) {
      const previous = player.history.find(r => r.fish === bonus.fish);

      if (previous !== undefined) {
        const weight = Math.round((previous.biggestWeight + bonus.weight * 0.01) * 100) / 100 + 1.0;

        addFish(player, bonus.fish, weight);

        resp = `Huh?! ✨ Something jumped out of the water to snatch your delicious candy! ...Got it! 🥍 ${bonus.fish} ${weight} lbs!`;
      }
    }

    player.canFishDate = Date.now();
    save(player);

    return resp;
  }

  // TODO: Add exceptions for releasing djinn and mermaids.

  let resp = `Bye bye ${fish}! 🫳🌊`;

  const bonus = random(SLOT_MACHINE(player));

  if (
    bonus.fish !== false &&
    bonus.weight > 1.0 &&
    (
      bonus.fish !== '🎰' ||
      (bonus.weight >= 10.0 && bonus.weight <= 12.5)
    )
  ) {
    addFish(player, bonus.fish, bonus.weight);
    resp += ` ...Huh? ✨ Something is glimmering in the ocean... 🥍${bonus.fish} Got it!`;
  }

  save(player);

  return resp;
}

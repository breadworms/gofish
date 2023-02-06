function reelIn(
  ocean: Ocean,
  x: number,
  y: number
): {
  fish: false | string,
  weight: number
} {
  let fish = ocean.map[(y - 1) * ocean.width + (x - 1)];

  if (fish === '🟦') {
    return { fish: false, weight: 0.0 };
  }

  if (typeof fish === 'function') {
    fish = fish();
  }

  const weight = Math.random() * x * y;

  // A match between the player's ID and the float value of the weight
  // means a shiny get.
  if (
    SHINIES[fish] !== undefined
    && id().substring(1, 5) === weight.toString().substring(4, 8)
  ) {
    fish += '*';
  }

  return {
    fish,
    weight: Math.round(weight * 100) / 100
  };
}

function random(ocean: Ocean) {
  return reelIn(ocean, utils.random(1, ocean.width), utils.random(1, ocean.height));
}

function forecast(player: Player, date: Date): Ocean {
  return (FORECAST[`${date.getMonth() + 1}.${date.getDate()}:${TIMEOFDAY[date.getHours()]}`]
    ?? CALM_OCEAN)(player);
}

function add(player: Player, fish: string, weight: number): void {
  const record = find(player, fish);

  if (record === undefined) {
    player.history.push({
      fish: fish.replace('*', ''),
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

function use(player: Player, gear: string, weight: number): boolean {
  if (Math.random() * 100 < weight / 2) {
    player.inventory.splice(player.inventory.indexOf(gear), 1);

    return true;
  }

  return false;
}

async function play(): Promise<string> {
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

  let ocean = forecast(player, date);

  let minRange = 1, maxRange = 10;
  let minDepth = 1, maxDepth = 10;

  // Go through player inventory, checking for lures, hooks and
  // slot machines.
  for (let i = player.inventory.length - 1; i > -1; i--) {
    if (player.inventory[i] === '🎰') {
      const slot = find(player, '🎰')!;

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

    return render(`The one that got away... ${fish} was too big to land!`);
  }

  add(player, fish, weight);

  let resp = `You caught a ${flair} ${fish} ${flair}! It weighs ${weight} lbs.`;

  // Check for pirate set bonus.
  if (
    player.inventory.includes('🗡️')
    && player.inventory.includes('👑')
    && player.inventory.includes('🧭')
  ) {
    const eaten = random(ocean);

    if (eaten.fish !== false && eaten.weight < weight) {
      add(player, eaten.fish, eaten.weight);

      resp += ` And!... ${eaten.fish} (${eaten.weight} lbs) was in its mouth!`;
    }
  }

  // `min*` being more than 1 means gear was found and should be
  // used.
  resp += (minRange > 1 && use(player, '🎏', weight) ? ' 🎏 broke!💢' : '')
    + (minDepth > 1 && use(player, '🪝', weight) ? ' 🪝 broke!💢' : '')
    + (weight > biggest ? ' A new record! 🎉' : '');

  // 8 height is slot machine, skip cooldown.
  if (ocean.height === 8) {
    player.canFishDate = now + 30000;
  } else {
    player.canFishDate = now + 1800000;
    resp += ' (30m cooldown after a catch)';
  }

  save(player);

  return render(resp);
}

function release(player: Player, index: number): string {
  const fish = player.inventory[index];
  let resp;

  player.inventory.splice(index, 1);

  if (fish === '🍬') {
    resp = `Delicious! 🫴👄`;
    player.canFishDate = Date.now();

    const thief = random(forecast(player, new Date()));

    if (thief.fish !== false) {
      const record = find(player, thief.fish);

      if (record !== undefined) {
        const weight = Math.round((
          record.biggestWeight + thief.weight * 0.02
        ) * 100) / 100 + 1.0;

        resp = `Huh?! ✨ Something jumped out of the water to snatch your delicious candy! ...Got it! 🥍 ${thief.fish} ${weight} lbs!`;
        add(player, thief.fish, weight);
      }
    }

  } else if (fish === '🧜‍♀️' || fish === '🧞‍♂️') {
    // Temporary, these will have functionality later so don't make
    // players waste it by releasing.
    return `Huh? ${fish} won't budge!`;

  } else {
    resp = `Bye bye ${fish}! 🫳🌊`;

    const glimmer = random(SLOT_MACHINE(player));

    // Constrain weights to artificially lower the odds, making the real
    // slot machine always much stronger.
    if (
      glimmer.fish !== false &&
      glimmer.weight > 1.0 &&
      (
        glimmer.fish !== '🎰' ||
        (glimmer.weight >= 10.0 && glimmer.weight <= 12.5)
      )
    ) {
      add(player, glimmer.fish, glimmer.weight);
      resp += ` ...Huh? ✨ Something is sparkling in the ocean... 🥍 ${glimmer.fish} Got it!`;
    }
  }

  save(player);

  return resp;
}

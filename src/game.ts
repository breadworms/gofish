function rng(seed: string): number {
  // This is just a hash function that does some string nonsense at the
  // end to get a number that is random enough for the game's purposes.

  let hash = 0x137560f155;

  for (let i = 0; i < seed.length; i++) {
    hash = Math.imul(hash ^ seed.charCodeAt(i), 2654435761);
  }

  return parseFloat(`0.${((hash ^ hash >>> 16) >>> 0).toString().slice(2)}`);
}

function forecast(player: Player, date: Date): Ocean {
  const month = date.getMonth();
  const weather = rng(`${date.getFullYear().toString().slice(-1)}${month}${date.getDate()}${TIMEOFDAY[date.getHours()]}`);

  if (weather > 0.99) {
    return FORECAST[month][4](player);
  } else if (weather > 0.95) {
    return FORECAST[month][3](player);
  } else if (weather > 0.8125) {
    return FORECAST[month][2](player);
  } else if (weather > 0.675) {
    return FORECAST[month][1](player);
  } else {
    return FORECAST[month][0](player);
  }
}

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

  // A match between the player's hash and the float value of the
  // weight means a shiny get.
  if (
    SHINIES[fish] !== undefined
    && rng(executor).toString().substring(2, 6) === weight.toString().substring(4, 8)
  ) {
    fish += '*';
  }

  return {
    fish,
    weight: Math.round(weight * 100) / 100
  };
}

function reelInRandom(ocean: Ocean) {
  return reelIn(ocean, utils.random(1, ocean.width), utils.random(1, ocean.height));
}

function add(player: Player, fish: string, weight: number): void {
  // Check if the fish breaks the player's previous records.
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

  // Add lifetime stats.
  player.lifetime += 1;
  player.lifetimeWeight = Math.round((player.lifetimeWeight + weight) * 100) / 100;

  // Add weekly channel-based stats.
  const currentWeek = weekId();

  // Clear stats if it's a new week.
  if (player.week !== currentWeek) {
    player.channels = {};
    player.week = currentWeek;
  }

  const channelRecords = player.channels[channel];

  if (channelRecords === undefined) {
    player.channels[channel] = {
      weekly: 1,
      weeklyWeight: weight,
      weeklyBiggest: weight
    };

  } else {
    channelRecords.weekly += 1;
    channelRecords.weeklyWeight = Math.round((channelRecords.weeklyWeight + weight) * 100) / 100;

    if (channelRecords.weeklyBiggest < weight) {
      channelRecords.weeklyBiggest = weight;
    }
  }

  // Add the fish to the player's inventory.
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
  const today = new Date();
  const now = today.getTime();

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

  let ocean = forecast(player, today);
  let rerolls = 0;
  let minRange = 1, maxRange = 10;
  let minDepth = 1, maxDepth = 10;

  // Go through player inventory, checking for lures, hooks, bobbers
  // and slot machines.
  for (let i = player.inventory.length - 1; i > -1; i--) {
    if (player.inventory[i] === 'disabled🎰') {
      const slot = find(player, '🎰')!;

      // A slot machine's biggest weight are the spins remaining.
      if (slot.biggestWeight <= 0) {
        player.inventory.splice(i, 1);

        continue;
      }

      ocean = SLOT_MACHINE(player);
      rerolls = 0;
      minRange = 1;
      minDepth = 1;
      maxRange = ocean.width;
      maxDepth = ocean.height;

      slot.biggestWeight -= 1;

      break;

    } else if (player.inventory[i] === '🪀' && rerolls === 0) {
      const bobber = find(player, '🪀')!;

      // A bobber's smallest weight being -1 means it's enabled.
      if (bobber.smallestWeight === -1) {
        // You gain a reroll every 5 minutes, up to the maximum of this
        // specific bobber. The bobber's smallest date is the time at
        // which it was enabled, while it's biggest weight is the number
        // of maximum rerolls.
        rerolls = Math.min((now - bobber.smallestDate) / 1000 / 60 / 5, bobber.biggestWeight);

        // Resetting biggest weight allows the next bobber catch to make
        // that bobber unique in number of rerolls since it will always
        // get a bigger weight than 0, setting a new `biggestDate`.
        bobber.smallestWeight = 0;
        bobber.biggestWeight = 0;
      }
    } else if (player.inventory[i] === '🎏') {
      minRange = 2;
      maxRange = ocean.width;

    } else if (player.inventory[i] === '🪝') {
      minDepth = 2;
      maxDepth = ocean.height;
    }
  }

  let { fish, weight } = reelIn(
    ocean,
    utils.random(minRange, maxRange),
    utils.random(minDepth, maxDepth)
  );

  while (rerolls > 1 && fish === false) {
    ({ fish, weight } = reelIn(
      ocean,
      utils.random(minRange, maxRange),
      utils.random(minDepth, maxDepth)
    ));

    rerolls -= 1;
  }

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
    player.inventory.includes('🧭')
    && player.inventory.includes('👑')
    && player.inventory.includes('🗡️')
  ) {
    const eaten = reelInRandom(ocean);

    if (eaten.fish !== false && eaten.weight < weight) {
      add(player, eaten.fish, eaten.weight);

      resp += ` And!... ${eaten.fish} (${eaten.weight} lbs) was in its mouth!`;
    }
  }

  // `min*` being more than 1 means gear was found and should be
  // used.
  resp += (minRange > 1 && use(player, '🎏', weight) ? ' 🎏 broke!💢' : '')
    + (minDepth > 1 && use(player, '🪝', weight) ? ' 🪝 broke!💢' : '')
    + (rerolls !== 0 && use(player, '🪀', weight) ? ' 🪀 broke!💢' : '');

  // Check for personal and channel-wide records.
  const realm = loadRealm();

  if (realm !== null && weight > realm.record) {
    realm.record = weight;
    resp += ` It's a channel-wide record! 🎊`;

    loadRealm(realm);
  } else if (weight > biggest) {
    resp += ` A new record! 🎉`;
  }

  // 5 height is slot machine, skip cooldown.
  if (ocean.height === 5) {
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

  switch (fish) {
    case '🪀': {
      const bobber = find(player, '🪀')!;

      if (bobber.smallestWeight === -1) {
        return `Reel your line in first!`;
      }

      bobber.smallestWeight = -1;
      bobber.smallestDate = Date.now();
      bobber.biggestWeight = 5 + rng(bobber.biggestDate.toString()) * 50;

      return `🪑 And now you wait...`;
    }

    case '🧜‍♀️':
    case '🧞‍♂️':
    case '🦆':
    case '🐧': {
      // Temporary, these will have functionality later so don't make
      // players waste it by releasing.
      return `Huh? ${fish} won't budge!`;
    }

    case '🍬': {
      player.inventory.splice(index, 1);
      player.canFishDate = Date.now();

      let resp = `Delicious! 🫴👄`;
      const thief = reelInRandom(forecast(player, new Date()));

      if (thief.fish !== false) {
        const record = find(player, thief.fish);

        if (record !== undefined) {
          const weight = Math.round((
            record.biggestWeight + thief.weight * 0.02
          ) * 100) / 100 + 1.0;

          add(player, thief.fish, weight);
          resp = `Huh?! ✨ Something jumped out of the water to snatch your rare candy! ...Got it! 🥍 ${thief.fish} ${weight} lbs!`;
        }
      }

      save(player);

      return resp;
    }

    default: {
      player.inventory.splice(index, 1);

      let resp = `Bye bye ${fish}! 🫳🌊`;
      const sparkle = reelInRandom(SLOT_MACHINE(player));

      // Constrain weights to artificially lower the odds, making the real
      // slot machine always much stronger.
      if (
        sparkle.fish !== false
        && (
          (
            sparkle.fish !== '🎰'
            && sparkle.weight > 1.0
            && sparkle.weight < 3.44
          )
          || (
            sparkle.weight >= 10.0
            && sparkle.weight <= 12.5
          )
        )
      ) {
        add(player, sparkle.fish, sparkle.weight);
        resp += ` ...Huh? ✨ Something is sparkling in the ocean... 🥍 ${sparkle.fish} Got it!`;
      }

      save(player);

      return resp;
    }
  }
}

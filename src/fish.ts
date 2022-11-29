function updateRecord(player: Player, fish: string, weight: number) {
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

function makeGear(inventory: string[], gear: string): [boolean, (weight: number) => boolean] {
  const index = inventory.indexOf(gear);

  if (index === -1) {
    return [false, () => false];
  }

  return [
    true,
    (weight: number) => {
      if (Math.random() * 100 < weight / 2) {
        inventory.splice(inventory.indexOf(gear), 1);

        return true;
      }

      return false;
    }
  ];
}

function fish() {
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

  const canFish = player.canFishDate - now;

  if (canFish > 0) {
    return `Ready to fish in ${canFish < 60000 ? Math.ceil(canFish / 1000) + 's' : Math.ceil(canFish / 1000 / 60) + 'm'}`;
  }

  const [hasLure, useLure] = makeGear(player.inventory, '🎏');
  const [hasHook, useHook] = makeGear(player.inventory, '🪝');

  const ocean = normalOcean ?? weatherForecast?.[date.getMonth() + 1]?.[date.getDate()] ?? normalOcean;
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

  if (hasPirateSet) {
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

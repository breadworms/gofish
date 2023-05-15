// Bless this mess
//

type PlayerTournamentStandings = Record<string, RealmRecord & { place: number }>;

function getPlayerStandings(realm: Realm, player: Player) {
  if (realm.week === '' || player.channels[channel] === undefined) {
    return false;
  }

  const standings: PlayerTournamentStandings = {};

  for (const category of Object.keys(player.channels[channel])) {
    const index = realm.categories[category].findIndex(r => r.heldBy.includes(executor));

    if (index === -1) {
      return false;
    }

    standings[category] = Object.assign(
      { place: index + 1},
      realm.categories[category][index]
    );
  }

  return standings;
}

function checkin(): string {
  const player = load();
  const realm = loadRealm();
  const date = new Date();
  const day = date.getDay();

  // Check if it's tournament day.
  if (day === 6) {
    if (date.getHours() < 16) {
      // It's not check-in time yet, show a countdown.
      return printCheckin(date);
    }

    // Check-in time. Add the player's records to the realm.
    const currentWeek = weekId();
    const playerRecords = player.channels[channel];

    if (playerRecords === undefined || player.week !== currentWeek) {
      return `You haven't caught anything in this chat! Go fish!`;
    }

    if (realm.week !== currentWeek) {
      realm.categories = {};
      realm.week = currentWeek;
    }

    let didWrite = false;

    for (const [category, value] of Object.entries(playerRecords)) {
      if (realm.categories[category] === undefined) {
        realm.categories[category] = [];
      }

      const records = realm.categories[category];
      const existingRecord = records.find(r => r.value === value);

      if (existingRecord !== undefined) {
        if (existingRecord.heldBy.includes(executor)) {
          continue;
        }

        existingRecord.heldBy.push(executor);
      } else {
        records.push({ value, heldBy: [executor] });
        records.sort((a, b) => b.value - a.value);
      }

      const oldRecordIndex = records.findIndex(r => r.value !== value && r.heldBy.includes(executor));

      if (oldRecordIndex !== -1) {
        const recordHolders = records[oldRecordIndex].heldBy;

        if (recordHolders.length > 1) {
          recordHolders.splice(recordHolders.indexOf(executor), 1);
        } else {
          records.splice(oldRecordIndex, 1);
        }
      }

      didWrite = true;
    }

    if (didWrite) {
      // Save the realm.
      loadRealm(realm);

      return `📟 Your fish have been counted and weighed!`;
    }

    // If there was no change, show the player their current standings.
    const standings = getPlayerStandings(realm, player) as PlayerTournamentStandings;

    let resp = `You sneak a peek at the current standings 📋... Total fish... 🪣 #${standings['weekly'].place}; by weight, ⚖️ #${standings['weeklyWeight'].place}; biggest fish, 🎣 #${standings['weeklyBiggest'].place}.`;

    if (standings['weekly'].place <= 5 || standings['weeklyWeight'].place <= 5 || standings['weeklyBiggest'].place <= 5) {
      resp += ` So far so good!`;
    } else {
      resp += ` You did your best.`;
    }

    return resp;
  }

  // It's not tournament day, and the player participated in last
  // week's tournament, we will show them their results. Otherwise,
  // show the time until the next tournament.
  const standings = getPlayerStandings(realm, player);

  if (standings === false) {
    return printCheckin(date);
  }

  const tenseString = day === 0 ? 'are' : 'were';
  const placeString = (p: number) => [`You ${tenseString} the champion ✨🏆✨!`, `You ${tenseString} the runner-up 🥈!`, `You got third place 🥉!`][p - 1]
    ?? p + (['st', 'nd', 'rd'][((p + 90) % 100 - 10) % 10 - 1] ?? 'th') + ' place.'

  return `${day === 0 ? '📣 The results are in!' : 'Last week...'} You caught 🪣 ${standings['weekly'].value} fish: ${placeString(standings['weekly'].place)} Together they weighed ⚖️ ${standings['weeklyWeight'].value} lbs: ${placeString(standings['weeklyWeight'].place)} Your biggest catch weighed 🎣 ${standings['weeklyBiggest'].value} lbs: ${placeString(standings['weeklyBiggest'].place)}`;
}

function printCheckin(date: Date): string {
  date.setHours(16, 0, 0, 0);
  date.setDate(date.getDate() - date.getDay() + 6);

  return `Check-in starts ${utils.timeDelta(date)}! 🗓️`;
}

async function main(playerArgs: string): Promise<string> {
  const [cmd, arg] = playerArgs.split(':');

  switch (cmd) {
    case 'checkin':
    case 'check-in':
      return checkin();

    default:
      return '🌴 Battle Cove... A place to compare yourself against other fishers. Use `check-in` for weekly fishing tournaments.';
  }
}

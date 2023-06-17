interface Ocean {
  readonly width: number;
  readonly height: number;
  readonly ambiance: string;
  readonly reports: () => {
    readonly current?: string;
    readonly impending: string;
    readonly continuous: string;
  };
  readonly map: readonly (string | (() => string))[];
}

type OceanResolver = (player: Player) => Ocean;

const CALM_OCEAN: OceanResolver = (p) => ({
  width: 20,
  height: 20,
  ambiance: `☁️ Nothing...`,
  reports: () => ({
    current: `📺💬 It's an ordinary day folks!`,
    impending: `Later, the weather will be calming down.`,
    continuous: `📺💬 It's an ordinary day folks! No precipitation ahead.`
  }),
  map: [
    // 1    2      3     4      5     6      7     8      9     10     11    12    13     14    15     16    17     18    19     20
    '🌿', '🧦', '🪝', '🪝', '🐸', '🟦', '🟦', '🟦', '🟦', '🟦', '🕷️', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐍', // 1
    '🎏', '🐚', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐠', '🪸', '🐡', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 2
    '🦀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 3
    '🎏', '🟦', '🟦', '🐟', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', ()=>p.inventory.includes('🗡️')?'🪨':'🗡️', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 4
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 5
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 6
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐬', '🟦', '🟦', '🟦', '🟦', '🐙', '🟦', // 7
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 8
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐋', '🟦', '🟦', '🟦', '🟦', // 9
    '💀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 10
    '🪳', '🟦', '🦐', '🟦', '🟦', '🟦', '🐢', '🦑', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 11
    '🐌', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 12
    '🟦', '🟦', '🦪', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 13
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 14
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐊', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦕', '🐉', '🟦', // 15
    '🟦', '🟦', '🟦', '🦞', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 16
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 17
    '🧽', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦈', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 18
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐳', '🟦', '🟦', '🟦', '🟦', // 19
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦' // 20
  ]
});

const RAINY_OCEAN: OceanResolver = (p) => ({
  width: 20,
  height: 20,
  ambiance: `🌧 It rains...`,
  reports: () => ({
    current: `📺💬 It's a rainy day folks, bring an umbrella!`,
    impending: `Don't make any big plans, there are rain clouds ahead and they're up to no good!`,
    continuous: `📺💬 Rain rain rain ahead folks!`
  }),
  map: [
    // 1    2      3     4      5     6      7     8      9     10     11    12    13     14    15     16    17     18    19     20
    '🌿', '🧦', '🪝', '🪝', '🟦', '🟦', '🟦', '🟦', '🐸', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🥒', '🟦', '🟦', '🐍', // 1
    '🎏', '🐚', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐠', '🪸', '🐡', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 2
    '🎏', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🕷️', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 3
    '🥫', '🟦', '🟦', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 4
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐬', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 5
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 6
    '🦀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐋', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 7
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 8
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 9
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐙', // 10
    '🟦', '🟦', '🟦', '🐢', '🟦', '🟦', '🟦', '🦑', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 11
    '🐌', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐊', '🟦', '🧜‍♀️', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 12
    '🟦', '🟦', '🦪', '🟦', '🟦', ()=>p.inventory.includes('👑')?'🪨':'👑', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 13
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 14
    '🟦', '🟦', '🟦', '🦐', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 15
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 16
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐉', '🟦', '🟦', '🟦', // 17
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦈', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 18
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦞', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐳', '🟦', '🟦', '🟦', '🟦', // 19
    '🪱', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦' // 20
  ]
});

const WINDY_OCEAN: OceanResolver = () => ({
  width: 20,
  height: 20,
  ambiance: `🎐 The wind...`,
  reports: () => ({
    current: `📺💬 Hold onto your hats folks! We are experiencing heavy winds.`,
    impending: `Bring a jacket folks, it's going to get windy later!`,
    continuous: `📺💬 Hold onto your hats folks! There are no signs of this wind calming down.`
  }),
  map: [
    // 1    2      3     4      5     6      7     8      9     10     11    12    13     14    15     16    17     18    19     20
    '🪶', '🩰', '☂️', '🪝', '🪝', '🟦', '🟦', '🟦', '🟦', '🟦', '🪵', '👒', '🟦', '🟦', '🟦', '🦆', '🟦', '🟦', '🟦', '🟦', // 1
    '🎏', '🐚', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐠', '🟦', '🐡', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 2
    '🥪', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐙', '🟦', '🟦', '🟦', '🟦', // 3
    '🎏', '🟦', '🟦', '🐟', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 4
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 5
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 6
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 7
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐬', '🟦', '🟦', '🟦', '🟦', '🟦', // 8
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 9
    '🦀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🧟', '🟦', '🟦', '🟦', '🐋', '🟦', '🟦', '🟦', '🟦', // 10
    '🪳', '🦐', '🟦', '🐢', '🟦', '🟦', '🟦', '🦑', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 11
    '🟦', '🦪', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 12
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 13
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦕', '🟦', '🟦', // 14
    '🟦', '🟦', '🦞', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐊', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 15
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 16
    '🪸', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐉', '🟦', '🟦', '🟦', // 17
    '🧽', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦈', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 18
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐳', '🟦', '🟦', '🟦', '🟦', // 19
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦' // 20
  ]
});

const FOGGY_OCEAN: OceanResolver = () => ({
  width: 20,
  height: 20,
  ambiance: `🌫️ So misty...`,
  reports: () => ({
    current: `📺💬 I've gone blind folks! Help! Oh, that's just the mist.`,
    impending: `Expect fog after.`,
    continuous: `📺💬 Heavy fog all day folks!`
  }),
  map: [
    // 1    2      3     4      5     6      7     8      9     10     11    12    13     14    15     16    17     18    19     20
    '🌿', '👟', '🪝', '🪝', '🪳', '🟦', '🟦', '🟦', '🟦', '🟦', '🦎', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦦', // 1
    '🎏', '🐚', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐠', '🪸', '🐡', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 2
    '🦀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 3
    '🎏', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐸', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 4
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 5
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐬', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 6
    '🟦', '🟦', '🟦', '🟦', '🟦', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 7
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐋', '🟦', '🟦', '🟦', '🟦', '🟦', // 8
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐙', '🟦', // 9
    '💀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 10
    '🦠', '🟦', '🦐', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 11
    '🪱', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦑', '🟦', '🟦', '🟦', '🧞‍♂️', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 12
    '🟦', '🟦', '🟦', '🟦', '🐢', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 13
    '🟦', '🟦', '🦪', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐊', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 14
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 15
    '🟦', '🟦', '🟦', '🟦', '🦞', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 16
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦕', '🟦', '🟦', '🟦', // 17
    '🍄', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦈', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 18
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐳', '🟦', '🟦', '🟦', '🟦', // 19
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦' // 20
  ]
});

const COLD_OCEAN: OceanResolver = () => ({
  width: 20,
  height: 20,
  ambiance: `❄️ It's freezing...`,
  reports: () => ({
    current: `📺💬 Brrrr, is it cold out folks! Bring a coat, or two!`,
    impending: `Bring a coat folks, it's gonna get below freezing later!`,
    continuous: `📺💬 Brrrr, this cold ain't going away folks! Bring a coat, or two!`
  }),
  map: [
    // 1    2      3     4      5     6      7     8      9     10     11    12    13     14    15     16    17     18    19     20
    '🧤', '👢', '🪝', '🪝', '🐸', '🟦', '🟦', '🟦', '🟦', '🟦', '🧊', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦦', // 1
    '🎏', '🐚', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦠', '🕷️', '🪳', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 2
    '🦀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 3
    '🎏', '🟦', '🟦', '🐟', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐙', '🟦', '🟦', '🟦', '🟦', // 4
    '🥫', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 5
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 6
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 7
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐬', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 8
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦭', '🟦', '🐋', '🟦', '🟦', '🟦', // 9
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 10
    '🪱', '🟦', '🦐', '🟦', '🐢', '🟦', '🟦', '🟦', '🐊', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 11
    '🧸', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 12
    '🟦', '🟦', '🦪', '🟦', '🦑', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 13
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 14
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦕', '🟦', '🟦', // 15
    '🟦', '🟦', '🟦', '🦞', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐍', '🟦', '🟦', '🟦', // 16
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 17
    '🍄', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦈', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 18
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐳', '🟦', '🟦', '🟦', '🟦', // 19
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦' // 20
  ]
});

const SUNLIT_OCEAN: OceanResolver = (p) => ({
  width: 20,
  height: 20,
  ambiance: `⛅ Sunshine...`,
  reports: () => ({
    current: `📺💬 It's shorts weather folks! Blue skies and sunshine!`,
    impending: `But don't despair! A nice summer breeze is ahead.`,
    continuous: `📺💬 Stop and smell the roses folks! It's a perfect summer day.`
  }),
  map: [
    // 1    2      3     4      5     6      7     8      9     10     11    12    13     14    15     16    17     18    19     20
    '🌿', '🩴', '🪝', '🪝', '🦐', '🟦', '🟦', '🟦', '🟦', '🟦', '🩲', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐍', // 1
    '🎏', '🐚', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🪼', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 2
    '🎏', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦪', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 3
    '🟦', '🟦', '🟦', '🐟', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦑', '🟦', '🟦', '🟦', '🟦', '🐙', '🟦', // 4
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 5
    '💀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 6
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 7
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐬', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 8
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐋', '🟦', '🟦', '🟦', // 9
    '🐠', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐊', '🟦', '🟦', '🟦', '🟦', '🟦', // 10
    '🕷️', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 11
    '🧃', '🟦', '🐡', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 12
    '🕶️', '🪳', '🦀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 13
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 14
    '🟦', '🧽', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐢', '🟦', '🐉', '🟦', // 15
    '🟦', '🥒', '🟦', '🦞', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 16
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 17
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦈', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 18
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐳', '🟦', '🟦', '🟦', '🟦', // 19
    '🟦', '🟦', '🟦', '🟦', '🪸', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦' // 20
  ]
});

const ICE_FISHING: OceanResolver = (p) => ({
  width: 11,
  height: 40,
  ambiance: `🌨 It's cold...`,
  reports: () => ({
    current: `📺💬 Let it snow folks!`,
    impending: `After that we've got some clouds coming in and it's gonna snow snow snow!`,
    continuous: `📺💬 Let it snow folks! Bring a coat and a pair of ice skates!`
  }),
  map: [
    // 1    2      3     4      5     6      7     8      9     10    11
    '🧣', '⛸️', '🪝', '🪝', '🐸', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 1
    '🪝', '🐚', '🟦', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐟', // 2
    '🦀', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐟', // 3
    '🪝', '🟦', '🟦', '🟦', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🐟', // 4
    '🥫', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 5
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐧', '🟦', '🟦', '🟦', '🟦', // 6
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 7
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 8
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 9
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 10
    '🪱', ()=>p.inventory.includes('🧭')?'🪨':'🧭', '🦐', '🟦', '🟦', '🟦', '🐢', '🟦', '🟦', '🟦', '🟦', // 11
    '🐌', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 12
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 13
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 14
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐊', '🟦', // 15
    '🟦', '🟦', '🟦', '🦞', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 16
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 17
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 18
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦪', '🟦', '🟦', '🟦', '🟦', // 19
    '🐍', '🟦', '🟦', '🟦', '🐬', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 20
    '🟦', '🟦', '🟦', '🟦', '🟦', '🐋', '🟦', '🟦', '🟦', '🟦', '🟦', // 21
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 22
    '🟦', '🟦', '🟦', '🦭', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 23
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐳', '🟦', '🟦', // 24
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 25
    '🟦', '🐙', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 26
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🐻‍❄️', // 27
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 28
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦈', '🟦', // 29
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 30
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 31
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 32
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 33
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 34
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 35
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 36
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 37
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 38
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦑', '🟦', '🟦', '🟦', // 39
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦' // 40
  ]
});

const DRY_LAKE: OceanResolver = () => ({
  width: 40,
  height: 10,
  ambiance: `☀️ It's so hot...`,
  reports: () => ({
    current: ``,
    impending: ``,
    continuous: ``
  }),
  map: []
});

const SPRING_POND: OceanResolver = () => ({
  width: 40,
  height: 10,
  ambiance: `🌱🪧 Nothing...`,
  reports: () => ({
    current: ``,
    impending: ``,
    continuous: ``
  }),
  map: []
});

const SUMMER_POND: OceanResolver = () => ({
  width: 40,
  height: 10,
  ambiance: `🌳🪧 Nothing...`,
  reports: () => ({
    current: ``,
    impending: ``,
    continuous: ``
  }),
  map: []
});

const AUTUMN_POND: OceanResolver = () => ({
  width: 20,
  height: 20,
  ambiance: `🍂🪧 Nothing...`,
  reports: () => ({
    current: ``,
    impending: ``,
    continuous: ``
  }),
  map: []
});

const WINTER_POND: OceanResolver = () => ({
  width: 11,
  height: 11,
  ambiance: `🌲🪧 Peaceful...`,
  reports: () => ({
    impending: `I'm signing off folks, tomorrow is my day off! I know I'll be spending my day at Acorn Pond and I'll be bringing my skates!`,
    continuous: `🙎 Oh, hello. Sonny Day here with the weather! Actually, this is my day off. But it is nice out.`
  }),
  map: [
    // 1    2      3     4      5     6      7     8      9     10    11
    '🌿', '🟦', '🐸', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🪵', '🟦', // 1
    '🐌', '🐚', '🐟', '🟦', '🐍', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 2
    '🟦', '🦐', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 3
    '🟦', '🟦', '🟦', '🐟', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🦫', // 4
    '🟦', '🟦', '🟦', '🟦', '🐢', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 5
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 6
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 7
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 8
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 9
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', // 10
    '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦' // 11
  ]
});

const TYPHOON: OceanResolver = () => ({
  width: 25,
  height: 16,
  ambiance: `🌪️ Eye of the storm...`,
  reports: () => ({
    current: ``,
    impending: ``,
    continuous: ``
  }),
  map: []
});

const THUNDERSTORM: OceanResolver = () => ({
  width: 16,
  height: 25,
  ambiance: `⛈️ A thunderstorm rages on...`,
  reports: () => ({
    current: ``,
    impending: ``,
    continuous: ``
  }),
  map: []
});

const BUGHUNT: OceanResolver = () => ({
  width: 11,
  height: 11,
  ambiance: `🏜️ No fish to be found...`,
  reports: () => ({
    current: ``,
    impending: ``,
    continuous: ``
  }),
  map: []
});

const GHOST_SHIP: OceanResolver = () => ({
  width: 11,
  height: 11,
  ambiance: `🏴‍☠️ Washed away... But where?`,
  reports: () => ({
    current: ``,
    impending: ``,
    continuous: ``
  }),
  map: []
});

const DESERT_ISLAND: OceanResolver = () => ({
  width: 11,
  height: 11,
  ambiance: `🏝️ Washed away...`,
  reports: () => ({
    current: ``,
    impending: ``,
    continuous: ``
  }),
  map: []
});

const ALIEN_SHIP: OceanResolver = () => ({
  width: 11,
  height: 11,
  ambiance: `🛸 ???`,
  reports: () => ({
    current: ``,
    impending: ``,
    continuous: ``
  }),
  map: []
});

const SLOT_MACHINE: OceanResolver = () => ({
  width: 5,
  height: 8,
  ambiance: `🎰 One more spin...`,
  reports: () => ({
    impending: '',
    continuous: ''
  }),
  map: [
    '🟦', '🍬', '🪝', '🟦', '🟦',
    '🟦', '🟦', '🟦', '🟦', '🟦',
    '🎏', '🟦', '🟦', '🟦', '🟦',
    '🟦', '🟦', '🟦', '🟦', '🟦',
    '🟦', '🟦', '🟦', '🟦', '🎰',
    '🟦', '🟦', '🟦', '🟦', '🟦',
    '🟦', '🟦', '🟦', '🟦', '🟦',
    '🟦', '🟦', '🟦', '🟦', '🟦'
  ]
});

const TIMEOFDAY: readonly string[] = [
  'n', 'n', 'n', 'n', 'n', 'n',
  'm', 'm', 'm', 'm', 'm', 'm',
  'a', 'a', 'a', 'a', 'a', 'a',
  'e', 'e', 'e', 'e', 'e', 'e'
];

const FORECAST: Readonly<Record<string, [OceanResolver, OceanResolver, OceanResolver, OceanResolver, OceanResolver]>> = {
  '4': [CALM_OCEAN, WINDY_OCEAN, FOGGY_OCEAN, RAINY_OCEAN, RAINY_OCEAN],
  '5': [CALM_OCEAN, WINDY_OCEAN, SUNLIT_OCEAN, RAINY_OCEAN, RAINY_OCEAN]
};

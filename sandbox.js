var data = {

};

var customData = {
  get: (key) => data[key],
  set: (key, value) => data[key] = value
};

var utils = {
  timeDelta: target => {
    const delta = target - Date.now();

    return `in ${delta < 60000 ? Math.ceil(delta / 1000) + 's' : Math.ceil(delta / 1000 / 60) + 'm'}`;
  },

  random: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  randArray: array => {
    return array[utils.random(0, array.length - 1)];
  },

  shuffleArray: array => {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = utils.random(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  },

  getEmote: (emotes, fallback) => {
    return Promise.resolve(emotes[0]);
  }
};

var executor = 'DrDisRespect';

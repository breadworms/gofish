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
  }
};

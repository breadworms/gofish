type WeatherForecast = {
  [month: number]: {
    [day: number]: Ocean
  }
};

const weatherForecast: WeatherForecast = {
  11: {
    29: rainyOcean
  },
  12: {
    1: rainyOcean,
    5: rainyOcean, 6: icyOcean,
    13: rainyOcean, 16: rainyOcean,
    24: icyOcean, 25: icyOcean,
    28: rainyOcean
  }
};

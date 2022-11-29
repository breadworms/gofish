class Ocean {
  private _map: string[];

  public readonly width: number;
  public readonly height: number;
  public readonly ambiance: string;

  constructor(width: number, height: number, ambiance: string, map: string[]) {
    this._map = map;

    this.width = width;
    this.height = height;
    this.ambiance = ambiance;
  }

  public random(long: boolean, deep: boolean): [false | string, number] {
    // Hardcoded: `10` max for short/shallow, `1` min offset for long/deep.
    const distance = Math.floor(Math.random() * (long ? this.width - 1 : 10)) + (long ? 1 : 0);
    const depth = Math.floor(Math.random() * (deep ? this.height - 1 : 10)) + (deep ? 1 : 0);
    const coord = depth * this.width + distance;

    if (this._map[coord] === '🟦') {
      return [false, 0.0];
    }

    return [
      this._map[coord],
      Math.round(Math.random() * (distance + 1) * (depth + 1) * 100) / 100
    ];
  }
}

const input = Bun.file("./input.txt");

const text = await input.text();

const grid = text.split("\n").map((line) => line.split(""));

class Vec2 {
  constructor(public readonly x: number, public readonly y: number) {}
  add(other: Vec2) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }
  negated() {
    return new Vec2(-this.x, -this.y);
  }
  toString() {
    return `${this.x},${this.y}`;
  }
  subtract(other: Vec2) {
    return new Vec2(this.x - other.x, this.y - other.y);
  }
}

const isInBounds = (pos: Vec2) =>
  pos.y >= 0 && pos.y < grid.length && pos.x >= 0 && pos.x < grid[pos.y].length;

const isFrequency = (value: string): value is Frequency =>
  /^[a-zA-Z0-9]+$/.test(value);

type Frequency = string;

class Antenna {
  constructor(
    public readonly pos: Vec2,
    public readonly frequency: Frequency
  ) {}

  getOverlappingPoints(other: Antenna) {
    const diff = this.pos.subtract(other.pos);
    const diffNegated = diff.negated();

    const points = [];

    let current = this.pos;
    while (true) {
      points.push(current);
      current = current.add(diff);
      if (!isInBounds(current)) {
        break;
      }
    }
    current = other.pos;
    while (true) {
      points.push(current);
      current = current.add(diffNegated);
      if (!isInBounds(current)) {
        break;
      }
    }

    return points;
  }
}

const allAntennas: Antenna[] = [];

for (let y = 0; y < grid.length; y++) {
  const row = grid[y];
  for (let x = 0; x < row.length; x++) {
    const pos = new Vec2(x, y);
    const frequency = grid[y][x];
    if (!isFrequency(frequency)) {
      continue;
    }

    allAntennas.push(new Antenna(pos, frequency));
  }
}

const antennaMap = new Map<Frequency, Antenna[]>();

for (const antenna of allAntennas) {
  const antennas = antennaMap.get(antenna.frequency) || [];
  antennas.push(antenna);
  antennaMap.set(antenna.frequency, antennas);
}

const overlappingPoints = new Set<string>();

for (const antennas of antennaMap.values()) {
  for (let firstIndex = 0; firstIndex < antennas.length; firstIndex++) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < antennas.length;
      secondIndex++
    ) {
      const antenna = antennas[firstIndex];
      const other = antennas[secondIndex];
      const points = antenna.getOverlappingPoints(other);
      for (const point of points) {
        overlappingPoints.add(point.toString());
      }
    }
  }
}

console.log(overlappingPoints);
console.log(overlappingPoints.size);

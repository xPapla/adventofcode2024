const input = Bun.file("./input.txt");

const text = await input.text();

const grid = text.split("\n").map((line) => line.split(""));

class Vec2 {
  constructor(public readonly x: number, public readonly y: number) {}
  add(other: Vec2) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }
  toString() {
    return `${this.x},${this.y}` as const;
  }
}

const DIRECTIONS = {
  LEFT: new Vec2(-1, 0),
  UP: new Vec2(0, -1),
  RIGHT: new Vec2(1, 0),
  DOWN: new Vec2(0, 1),
};

const isInBounds = (pos: Vec2) =>
  pos.y >= 0 && pos.y < grid.length && pos.x >= 0 && pos.x < grid[pos.y].length;

const getChar = (pos: Vec2) => {
  if (!isInBounds(pos)) {
    return null;
  }

  return grid[pos.y][pos.x];
};

const CORNERS = {
  TOP_LEFT: [DIRECTIONS.UP, DIRECTIONS.LEFT],
  TOP_RIGHT: [DIRECTIONS.UP, DIRECTIONS.RIGHT],
  BOTTOM_LEFT: [DIRECTIONS.DOWN, DIRECTIONS.LEFT],
  BOTTOM_RIGHT: [DIRECTIONS.DOWN, DIRECTIONS.RIGHT],
};

class Region {
  readonly positions = new Set<`${number},${number}`>();

  get area() {
    return this.positions.size;
  }

  get perimeter() {
    let perimeter = 0;
    for (const pos of this.positions) {
      const [x, y] = pos.split(",").map(Number);
      for (const direction of Object.values(DIRECTIONS)) {
        const newPos = new Vec2(x, y).add(direction);
        if (!this.has(newPos)) {
          perimeter++;
        }
      }
    }
    return perimeter;
  }

  private countCorners(pos: Vec2) {
    let corners = 0;

    for (const [dir1, dir2] of Object.values(CORNERS)) {
      const hasVertical = this.positions.has(pos.add(dir1).toString());
      const hasHorizontal = this.positions.has(pos.add(dir2).toString());
      const hasDiagonal = this.positions.has(
        pos.add(dir1).add(dir2).toString()
      );

      if (
        (!hasVertical && !hasHorizontal) ||
        (hasVertical && hasHorizontal && !hasDiagonal)
      ) {
        corners++;
      }
    }

    return corners;
  }

  get sides(): number {
    let corners = 0;

    for (const posStr of this.positions) {
      const [x, y] = posStr.split(",").map(Number);
      const pos = new Vec2(x, y);
      corners += this.countCorners(pos);
    }

    return corners;
  }

  add(pos: Vec2) {
    this.positions.add(pos.toString());
  }

  has(pos: Vec2) {
    return this.positions.has(pos.toString());
  }
}

const visited = new Set<`${number},${number}`>();
const regions: Region[] = [];

for (let y = 0; y < grid.length; y++) {
  const row = grid[y];
  for (let x = 0; x < row.length; x++) {
    const startPos = new Vec2(x, y);
    if (visited.has(startPos.toString())) {
      continue;
    }

    const startChar = getChar(startPos)!;
    const region = new Region();

    const queue = [
      startPos,
      ...Object.values(DIRECTIONS).map((dir) => startPos.add(dir)),
    ];

    while (true) {
      const pos = queue.shift();
      if (!pos) {
        break;
      }
      if (visited.has(pos.toString())) {
        continue;
      }
      const char = getChar(pos);
      if (char !== startChar) {
        continue;
      }

      visited.add(pos.toString());
      region.add(pos);

      for (const direction of Object.values(DIRECTIONS)) {
        const newPos = pos.add(direction);
        queue.push(newPos);
      }
    }

    regions.push(region);
  }
}

console.log(`visited: ${visited.size} out of ${grid.length * grid[0].length}`);
console.log(`Regions: ${regions.length}`);
console.log(
  `Total price p1: ${regions
    .map((r) => r.area * r.perimeter)
    .reduce((a, b) => a + b, 0)}`
);
console.log(
  `Total price p2: ${regions
    .map((r) => r.area * r.sides)
    .reduce((a, b) => a + b, 0)}`
);

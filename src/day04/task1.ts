const input = Bun.file("./input.txt");

const text = await input.text();

const grid = text.split("\n").map((line) => line.split(""));

class Vec2 {
  constructor(public x: number, public y: number) {}
  add(other: Vec2) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }
}

const getLetter = (pos: Vec2) => {
  if (
    pos.x < 0 ||
    pos.x >= grid[0].length ||
    pos.y < 0 ||
    pos.y >= grid.length
  ) {
    return null;
  }

  return grid[pos.y][pos.x];
};

const DIRECTIONS = {
  LEFT: new Vec2(-1, 0),
  RIGHT: new Vec2(1, 0),
  UP: new Vec2(0, -1),
  DOWN: new Vec2(0, 1),
  UP_LEFT: new Vec2(-1, -1),
  UP_RIGHT: new Vec2(1, -1),
  DOWN_LEFT: new Vec2(-1, 1),
  DOWN_RIGHT: new Vec2(1, 1),
};

const PATTERN = "XMAS";

let count = 0;

for (let y = 0; y < grid.length; y++) {
  const row = grid[y];
  for (let x = 0; x < row.length; x++) {
    const pos = new Vec2(x, y);

    if (getLetter(pos) !== PATTERN[0]) {
      continue;
    }

    for (const dir of Object.values(DIRECTIONS)) {
      let found = true;
      let newPos = pos;
      for (let i = 1; i < PATTERN.length; i++) {
        newPos = newPos.add(dir);
        if (getLetter(newPos) !== PATTERN[i]) {
          found = false;
          break;
        }
      }

      if (found) {
        count++;
      }
    }
  }
}

console.log(count);

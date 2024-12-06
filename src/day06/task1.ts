const input = Bun.file("./input.txt");

const text = await input.text();

const grid = text.split("\n").map((line) => line.split(""));

class Vec2 {
  constructor(public x: number, public y: number) {}
  add(other: Vec2) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }
}

type Field = "obstacle" | "empty";

const getChar = (pos: Vec2): Field | null => {
  if (
    pos.x < 0 ||
    pos.x >= grid[0].length ||
    pos.y < 0 ||
    pos.y >= grid.length
  ) {
    return null;
  }

  const char = grid[pos.y][pos.x];

  return char === "#" ? "obstacle" : "empty";
};

const DIRECTIONS = {
  LEFT: new Vec2(-1, 0),
  UP: new Vec2(0, -1),
  RIGHT: new Vec2(1, 0),
  DOWN: new Vec2(0, 1),
};

// find "^" in grid
const startPos = grid.reduce((acc, row, y) => {
  if (acc) {
    return acc;
  }

  const x = row.indexOf("^");

  if (x !== -1) {
    return new Vec2(x, y);
  }

  return null;
}, null as Vec2 | null);

const rotateRight = (vec2: Vec2) => {
  return new Vec2(-vec2.y, vec2.x);
};

if (!startPos) {
  throw new Error("Start position not found");
}

let direction = DIRECTIONS.UP;
let pos = startPos;

const visited = new Set<string>();

while (true) {
  const key = `${pos.x},${pos.y}`;
  visited.add(key);

  const nextPosCandidate = pos.add(direction);

  const nextBlock = getChar(nextPosCandidate);
  if (nextBlock === null) {
    break;
  }
  if (nextBlock === "obstacle") {
    direction = rotateRight(direction);
    continue;
  }
  // nextChar === "empty"

  pos = nextPosCandidate;
}

console.log(visited.size);

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

  ZERO: new Vec2(0, 0),
};

const DIAGONAL = {
  first: [DIRECTIONS.UP_LEFT, DIRECTIONS.ZERO, DIRECTIONS.DOWN_RIGHT], // or reverted
  second: [DIRECTIONS.UP_RIGHT, DIRECTIONS.ZERO, DIRECTIONS.DOWN_LEFT], // or reverted
};

const PATTERN = "MAS";

const verifyPattern = (
  positionOfA: Vec2,
  lettersPositions: ReadonlyArray<Vec2>
) => {
  if (PATTERN.length !== lettersPositions.length) {
    throw new Error("Invalid pattern");
  }

  for (let i = 0; i < PATTERN.length; i++) {
    const letter = getLetter(positionOfA.add(lettersPositions[i]));
    if (letter !== PATTERN[i]) {
      return false;
    }
  }

  return true;
};

let count = 0;

for (let y = 0; y < grid.length; y++) {
  const row = grid[y];
  for (let x = 0; x < row.length; x++) {
    const pos = new Vec2(x, y);

    if (getLetter(pos) !== "A") {
      continue;
    }

    if (
      !verifyPattern(pos, DIAGONAL.first) &&
      !verifyPattern(pos, DIAGONAL.first.toReversed())
    ) {
      continue;
    }

    if (
      !verifyPattern(pos, DIAGONAL.second) &&
      !verifyPattern(pos, DIAGONAL.second.toReversed())
    ) {
      continue;
    }

    count += 1;
  }
}

console.log(count);

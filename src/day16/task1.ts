const input = Bun.file("./input.txt");

const text = await input.text();

const grid = text.split("\n").map((line) => line.split(""));

class Vec2 {
  constructor(public readonly x: number, public readonly y: number) {}
  add(other: Vec2) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }
  toString() {
    return `${this.x},${this.y}`;
  }
}

const DIRECTIONS = {
  UP: new Vec2(0, -1),
  DOWN: new Vec2(0, 1),
  LEFT: new Vec2(-1, 0),
  RIGHT: new Vec2(1, 0),
};

const rotateRight = (vec2: Vec2) => {
  return new Vec2(-vec2.y, vec2.x);
};

const rotateLeft = (vec2: Vec2) => {
  return new Vec2(vec2.y, -vec2.x);
};

let start: Vec2 | null = null;
findStart: for (let y = 0; y < grid.length; y++) {
  const row = grid[y];
  for (let x = 0; x < row.length; x++) {
    if (grid[y][x] === "S") {
      start = new Vec2(x, y);
      break findStart;
    }
  }
}

if (!start) {
  throw new Error("Start position not found");
}

const scoreGrid = grid.map((row) => row.map(() => Infinity));

type QueueItem = {
  pos: Vec2;
  direction: Vec2;
  currentScore: number;
};

const queue: QueueItem[] = [
  { pos: start, direction: DIRECTIONS.RIGHT, currentScore: 0 },
];

let lowestScore = Infinity;

while (queue.length > 0) {
  console.log(`Queue length: ${queue.length}`);
  const current = queue.shift();
  if (!current) {
    break;
  }
  const currentChar = grid[current.pos.y][current.pos.x];
  if (currentChar === "#") {
    continue;
  }

  const previousScore = scoreGrid[current.pos.y][current.pos.x];
  const currentScore = current.currentScore;

  if (currentScore >= previousScore) {
    continue;
  }

  scoreGrid[current.pos.y][current.pos.x] = currentScore;

  if (currentChar === "E") {
    console.log("Found exit", currentScore);
    lowestScore = Math.min(lowestScore, currentScore);
    continue;
  }

  queue.push({
    pos: current.pos.add(current.direction),
    direction: current.direction,
    currentScore: current.currentScore + 1,
  });
  const rotatedRight = rotateRight(current.direction);
  queue.push({
    pos: current.pos.add(rotatedRight),
    direction: rotatedRight,
    currentScore: current.currentScore + 1000 + 1,
  });
  const rotatedLeft = rotateLeft(current.direction);
  queue.push({
    pos: current.pos.add(rotatedLeft),
    direction: rotatedLeft,
    currentScore: current.currentScore + 1000 + 1,
  });
}

console.log(`Lowest score: ${lowestScore}`);

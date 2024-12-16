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
let end: Vec2 | null = null;
findStart: for (let y = 0; y < grid.length; y++) {
  const row = grid[y];
  for (let x = 0; x < row.length; x++) {
    if (grid[y][x] === "S") {
      start = new Vec2(x, y);
    }
    if (grid[y][x] === "E") {
      end = new Vec2(x, y);
    }
    if (start && end) {
      break findStart;
    }
  }
}

if (!start || !end) {
  throw new Error("Start or end position not found");
}

const scoreGrid = grid.map((row) => row.map(() => new Set<number>([Infinity])));

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

  const previousScores = scoreGrid[current.pos.y][current.pos.x];
  const currentScore = current.currentScore;
  const lowestPreviousScore = Math.min(...previousScores);

  previousScores.add(currentScore);

  if (currentScore >= lowestPreviousScore) {
    continue;
  }

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

// const SIZE = 18;
// console.log(`Score grid:
// ${scoreGrid
//   .map((row) =>
//     row
//       .map((score) =>
//         (score.size === 1
//           ? "∞".repeat(SIZE)
//           : score
//               .values()
//               .toArray()
//               .filter((v) => isFinite(v))
//               .join(",")
//         ).padStart(SIZE, " ")
//       )
//       .join(" ")
//   )
//   .join("\n")}`);

console.log(`Lowest score: ${lowestScore}`);

type Queue2Items = {
  pos: Vec2;
  direction: Vec2;
  expectedScore: number;
};

const queue2: Queue2Items[] = [
  { pos: end, direction: DIRECTIONS.RIGHT, expectedScore: lowestScore },
  { pos: end, direction: DIRECTIONS.LEFT, expectedScore: lowestScore },
  { pos: end, direction: DIRECTIONS.UP, expectedScore: lowestScore },
  { pos: end, direction: DIRECTIONS.DOWN, expectedScore: lowestScore },
];

let correct = new Set<string>();

while (queue2.length > 0) {
  const current = queue2.shift();
  if (!current) {
    break;
  }

  const currentScores = scoreGrid[current.pos.y][current.pos.x];
  if (!currentScores.has(current.expectedScore)) {
    continue;
  }

  correct.add(current.pos.toString());

  queue2.push({
    pos: current.pos.add(current.direction),
    direction: current.direction,
    expectedScore: current.expectedScore - 1,
  });
  const rotatedRight = rotateRight(current.direction);
  queue2.push({
    pos: current.pos.add(current.direction),
    direction: rotatedRight,
    expectedScore: current.expectedScore - 1000 - 1,
  });
  const rotatedLeft = rotateLeft(current.direction);
  queue2.push({
    pos: current.pos.add(current.direction),
    direction: rotatedLeft,
    expectedScore: current.expectedScore - 1000 - 1,
  });
}

console.log(`Correct: ${correct.size}`);

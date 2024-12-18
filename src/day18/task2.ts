console.time("task2");
const input = Bun.file("./input.txt");

const text = await input.text();

const WIDTH = 71;
const HEIGHT = 71;

class Vec2 {
  constructor(public readonly x: number, public readonly y: number) {}
  add(other: Vec2) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }
  toString() {
    return `${this.x},${this.y}`;
  }
}

const corruptions = text
  .split("\n")
  .map((line) => line.split(",").map(Number) as [number, number])
  .map(([x, y]) => new Vec2(x, y));

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

const validate = (N: number) => {
  const start = new Vec2(0, 0);
  const end = new Vec2(WIDTH - 1, HEIGHT - 1);
  const corruptionsToApply = corruptions.slice(0, N);

  const grid = [];
  for (let y = 0; y < HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < WIDTH; x++) {
      const isCorrupted = corruptionsToApply.some(
        (corruption) => corruption.x === x && corruption.y === y
      );
      row.push(isCorrupted ? "#" : ".");
    }
    grid.push(row);
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
    // console.log(`Queue length: ${queue.length}`);
    const current = queue.shift();
    if (!current) {
      break;
    }
    // is in bounds
    if (
      current.pos.x < 0 ||
      current.pos.x >= WIDTH ||
      current.pos.y < 0 ||
      current.pos.y >= HEIGHT
    ) {
      continue;
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

    if (current.pos.x === end.x && current.pos.y === end.y) {
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
      currentScore: current.currentScore + 1,
    });
    const rotatedLeft = rotateLeft(current.direction);
    queue.push({
      pos: current.pos.add(rotatedLeft),
      direction: rotatedLeft,
      currentScore: current.currentScore + 1,
    });
  }

  return isFinite(lowestScore);
};

let currentN = 1024;
while (true) {
  // console.log(`Current N: ${currentN}`);
  if (!validate(currentN)) {
    break;
  }
  currentN += 100;
}
while (true) {
  // console.log(`Current N: ${currentN}`);
  if (validate(currentN)) {
    break;
  }
  currentN--;
}
console.log(`Max N: ${currentN}`);
console.log(corruptions[currentN].toString());

console.timeEnd("task2");

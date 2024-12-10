const input = Bun.file("./input.txt");

const text = await input.text();

const grid = text
  .split("\n")
  .map((line) => line.split("").map((v) => parseInt(v, 10)));

class Vec2 {
  constructor(public readonly x: number, public readonly y: number) {}
  add(other: Vec2) {
    return new Vec2(this.x + other.x, this.y + other.y);
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

const trailHeads = grid.reduce(
  (acc, row, y) =>
    row.reduce((acc, cell, x) => {
      if (cell === 0) {
        acc.push(new Vec2(x, y));
      }
      return acc;
    }, acc),
  [] as Vec2[]
);

let count = 0;
// head.x,head.y,end.x,end.y
const trails = new Set<`${number},${number},${number},${number}`>();

const move = (startPos: Vec2, pos: Vec2, currentValue: number) => {
  if (currentValue === 9) {
    count += 1;
    trails.add(`${startPos.x},${startPos.y},${pos.x},${pos.y}`);
    return;
  }

  const nextPos = Object.values(DIRECTIONS)
    .map((dir) => pos.add(dir))
    .filter((nextPos) => isInBounds(nextPos))
    .filter((nextPos) => grid[nextPos.y][nextPos.x] === currentValue + 1);

  for (const next of nextPos) {
    move(startPos, next, currentValue + 1);
  }
};

for (const head of trailHeads) {
  move(head, head, 0);
}

console.log(trails);
console.log(trails.size); // p1
console.log(count); // p2

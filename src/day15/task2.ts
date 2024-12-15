const input = Bun.file("./input.txt");

const text = await input.text();

class Vec2 {
  constructor(public x: number, public y: number) {}
  add(other: Vec2) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }
  toString() {
    return `${this.x},${this.y}`;
  }
}

const isInBounds = (pos: Vec2) =>
  pos.y >= 0 &&
  pos.y < map.length &&
  pos.x >= 0 &&
  pos.x < map[pos.y].length * 2;

const DIRECTIONS = {
  LEFT: new Vec2(-1, 0),
  RIGHT: new Vec2(1, 0),
  UP: new Vec2(0, -1),
  DOWN: new Vec2(0, 1),
};

const [mapStr, movesStr] = text.split("\n\n");
const map = mapStr.split("\n").map((line) => line.split(""));
const moves = movesStr
  .split("")
  .map((move) =>
    move === "^"
      ? DIRECTIONS.UP
      : move === "v"
      ? DIRECTIONS.DOWN
      : move === "<"
      ? DIRECTIONS.LEFT
      : move === ">"
      ? DIRECTIONS.RIGHT
      : null
  )
  .filter((m) => m !== null);

class Robot {
  constructor(public p: Vec2) {}
  move(dir: Vec2) {
    this.p = this.p.add(dir);
  }
}

class Box {
  constructor(public p1: Vec2, public p2: Vec2) {}
  move(dir: Vec2) {
    this.p1 = this.p1.add(dir);
    this.p2 = this.p2.add(dir);
  }
}

class Wall {
  constructor(public p: Vec2) {}
}

let robot: Robot | undefined;
const boxes: Box[] = [];
const walls: Wall[] = [];

for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    const cell = map[y][x];
    //everything is now twice as wide
    const p1 = new Vec2(x * 2, y);
    const p2 = new Vec2(x * 2 + 1, y);
    switch (cell) {
      case "#":
        // wall takes both positions
        walls.push(new Wall(p1));
        walls.push(new Wall(p2));
        break;
      case "@":
        // robot takes only left position
        robot = new Robot(p1);
        break;
      case "O":
        // box takes both positions
        boxes.push(new Box(p1, p2));
        break;
    }
  }
}

if (!robot) {
  throw new Error("No robot found");
}

const drawMap = () => {
  let out = "";
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length * 2; x++) {
      const p = new Vec2(x, y);
      const wall = walls.find((w) => w.p.x === p.x && w.p.y === p.y);
      if (wall) {
        out += "#";
        continue;
      }
      const box1 = boxes.find((b) => b.p1.x === p.x && b.p1.y === p.y);
      if (box1) {
        out += "[";
        continue;
      }
      const box2 = boxes.find((b) => b.p2.x === p.x && b.p2.y === p.y);
      if (box2) {
        out += "]";
        continue;
      }
      const r = robot.p.x === p.x && robot.p.y === p.y;
      if (r) {
        out += "@";
        continue;
      }
      out += ".";
    }
    out += "\n";
  }
  console.log(out + "\n\n");
};

for (let i = 0; i < moves.length; i++) {
  const move = moves[i];
  // drawMap();
  console.log(`Move ${i + 1}/${moves.length}`);

  const moveThose = new Set<Box>();
  const hasFreeSpaceInLine = (() => {
    let queue = [robot.p.add(move)];
    while (queue.length >= 0) {
      const pos = queue.shift();
      if (!pos) {
        return true;
      }

      const wall = walls.find((w) => w.p.x === pos.x && w.p.y === pos.y);
      if (wall) {
        return false;
      }
      const box = boxes.find(
        (b) =>
          (b.p1.x === pos.x && b.p1.y === pos.y) ||
          (b.p2.x === pos.x && b.p2.y === pos.y)
      );
      if (box) {
        moveThose.add(box);
        if (move.x > 0) {
          // move right
          queue.push(box.p2.add(move));
        } else if (move.x < 0) {
          // move left
          queue.push(box.p1.add(move));
        } else {
          // move up or down
          queue.push(box.p1.add(move));
          queue.push(box.p2.add(move));
        }
      }
    }
  })();

  console.log({ hasFreeSpaceInLine });
  if (!hasFreeSpaceInLine) {
    continue;
  }

  robot.move(move);
  for (const box of moveThose) {
    box.move(move);
  }
}

drawMap();

let sum = 0;
for (const box of boxes) {
  sum += box.p1.x + 100 * box.p1.y;
}

console.log({ sum });

const input = Bun.file("./input.txt");

const text = await input.text();

class Vec2 {
  constructor(public x: number, public y: number) {}
  add(other: Vec2) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }
}

const isInBounds = (pos: Vec2) =>
  pos.y >= 0 && pos.y < map.length && pos.x >= 0 && pos.x < map[pos.y].length;

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
  constructor(public p: Vec2) {}
  move(dir: Vec2) {
    this.p = this.p.add(dir);
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
    const p = new Vec2(x, y);
    const cell = map[y][x];
    switch (cell) {
      case "#":
        walls.push(new Wall(p));
        break;
      case "@":
        robot = new Robot(p);
        break;
      case "O":
        boxes.push(new Box(p));
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
    for (let x = 0; x < map[y].length; x++) {
      const p = new Vec2(x, y);
      const wall = walls.find((w) => w.p.x === p.x && w.p.y === p.y);
      if (wall) {
        out += "#";
        continue;
      }
      const box = boxes.find((b) => b.p.x === p.x && b.p.y === p.y);
      if (box) {
        out += "O";
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

  const moveThose: Box[] = [];
  const hasFreeSpaceInLine = (() => {
    let pos = robot.p;
    while (isInBounds(pos)) {
      pos = pos.add(move);
      const wall = walls.find((w) => w.p.x === pos.x && w.p.y === pos.y);
      if (wall) {
        return false;
      }
      const box = boxes.find((b) => b.p.x === pos.x && b.p.y === pos.y);
      if (!box) {
        return true;
      }
      moveThose.push(box);
    }
    return false;
  })();

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
  sum += box.p.x + 100 * box.p.y;
}

console.log({ sum });

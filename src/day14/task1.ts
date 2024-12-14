const input = Bun.file("./input.txt");

const text = await input.text();

const lines = text.split("\n");

class Vec2 {
  constructor(public readonly x: number, public readonly y: number) {}
  add(other: Vec2) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }
  toString() {
    return `${this.x},${this.y}`;
  }
}

const MAP_HEIGHT = 103;
const MAP_WIDTH = 101;

const isInBounds = (pos: Vec2) =>
  pos.y >= 0 && pos.y < MAP_HEIGHT && pos.x >= 0 && pos.x < MAP_WIDTH;

class Robot {
  constructor(public p: Vec2, public v: Vec2) {}
  move() {
    this.p = this.p.add(this.v);
    if (!isInBounds(this.p)) {
      this.p = new Vec2(
        (this.p.x + MAP_WIDTH) % MAP_WIDTH,
        (this.p.y + MAP_HEIGHT) % MAP_HEIGHT
      );
    }
  }
}

function* makeReader() {
  // "p=0,4 v=3,-3"
  const parseLine = (line: string) => {
    const [p, v] = line.split(" ");
    const [px, py] = p
      .split("=")[1]
      .split(",")
      .map((v) => parseInt(v, 10));
    const [vx, vy] = v
      .split("=")[1]
      .split(",")
      .map((v) => parseInt(v, 10));
    return { p: new Vec2(px, py), v: new Vec2(vx, vy) };
  };

  let index = 0;
  while (index < lines.length) {
    const { p, v } = parseLine(lines[index]);
    yield new Robot(p, v);
    index += 1;
  }
}

const robots = Array.from(makeReader());
for (let i = 0; i < 100; i++) {
  robots.forEach((r) => r.move());
}

const robotsPerQuadrant = robots.reduce(
  (acc, r) => {
    if (r.p.x > (MAP_WIDTH - 1) / 2 && r.p.y > (MAP_HEIGHT - 1) / 2) {
      acc.BOTTOM_RIGHT += 1;
    }
    if (r.p.x > (MAP_WIDTH - 1) / 2 && r.p.y < (MAP_HEIGHT - 1) / 2) {
      acc.TOP_RIGHT += 1;
    }
    if (r.p.x < (MAP_WIDTH - 1) / 2 && r.p.y > (MAP_HEIGHT - 1) / 2) {
      acc.BOTTOM_LEFT += 1;
    }
    if (r.p.x < (MAP_WIDTH - 1) / 2 && r.p.y < (MAP_HEIGHT - 1) / 2) {
      acc.TOP_LEFT += 1;
    }

    return acc;
  },
  { TOP_LEFT: 0, TOP_RIGHT: 0, BOTTOM_LEFT: 0, BOTTOM_RIGHT: 0 }
);

let map = "";
for (let y = 0; y < MAP_HEIGHT; y++) {
  for (let x = 0; x < MAP_WIDTH; x++) {
    const isRobot = robots.reduce(
      (acc, r) => acc + Number(r.p.x === x && r.p.y === y),
      0
    );
    const isMiddleOfRow = x === (MAP_WIDTH - 1) / 2;
    const isMiddleOfColumn = y === (MAP_HEIGHT - 1) / 2;
    map += isMiddleOfRow
      ? "|"
      : isMiddleOfColumn
      ? "-"
      : isRobot
      ? isRobot
      : ".";
  }
  map += "\n";
}

console.log(map);
console.log(`Total robots: ${robots.length}`);
console.log(robotsPerQuadrant);
console.log(
  robotsPerQuadrant.TOP_LEFT *
    robotsPerQuadrant.TOP_RIGHT *
    robotsPerQuadrant.BOTTOM_LEFT *
    robotsPerQuadrant.BOTTOM_RIGHT
);

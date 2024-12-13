const input = Bun.file("./input.txt");

const text = await input.text();

const lines = text.split("\n");

function* makeReader() {
  // "Button A: X+94, Y+34"
  const parseButton = (line: string) => {
    const [, coords] = line.split(": ");
    const [x, y] = coords.split(", ").map((v) => parseInt(v.slice(2), 10));
    return { x, y };
  };

  // "Prize: X=8400, Y=5400"
  const parsePrize = (line: string) => {
    const [, coords] = line.split(": ");
    const [x, y] = coords.split(", ").map((v) => parseInt(v.slice(2), 10));
    return { x: x + 10000000000000, y: y + 10000000000000 };
  };

  let index = 0;
  while (index < lines.length) {
    const buttonA = parseButton(lines[index]);
    const buttonB = parseButton(lines[index + 1]);
    const prize = parsePrize(lines[index + 2]);
    yield { buttonA, buttonB, prize };

    index += 4;
  }
}

// A1a + B1b = C1
// A2a + B2b = C2
const solveTwoEquations = (
  A1: number,
  B1: number,
  C1: number,
  A2: number,
  B2: number,
  C2: number
) => {
  const b = (A1 * C2 - A2 * C1) / (A1 * B2 - A2 * B1);
  const a = (C2 - B2 * b) / A2;
  return { a, b };
};

let total = 0;

for (const { buttonA, buttonB, prize } of makeReader()) {
  const { a, b } = solveTwoEquations(
    buttonA.x,
    buttonB.x,
    prize.x,
    buttonA.y,
    buttonB.y,
    prize.y
  );

  if (a > 0 && b > 0 && Number.isInteger(a) && Number.isInteger(b)) {
    total += a * 3 + b * 1;
  }
}

console.log({ total });

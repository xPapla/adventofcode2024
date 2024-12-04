const input = Bun.file("./input.txt");

const text = await input.text();

const lines = text.split("\n");

let safe = 0;

line: for (const line of lines) {
  const numbers = line.split(" ").map((number) => parseInt(number, 10));

  const decreasing = numbers[1] < numbers[0];

  for (let i = 0; i < numbers.length - 1; i++) {
    const diff = numbers[i + 1] - numbers[i];
    const diffAbs = Math.abs(diff);
    if (diffAbs < 1 || diffAbs > 3) {
      continue line;
    }
    if ((diff > 0 && decreasing) || (diff < 0 && !decreasing)) {
      continue line;
    }
  }
  safe += 1;
}

console.log(safe);

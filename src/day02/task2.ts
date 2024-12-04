const input = Bun.file("./input.txt");

const text = await input.text();

const lines = text.split("\n");

let safe = 0;

const verifyLine = (numbers: number[]) => {
  const decreasing = numbers[1] < numbers[0];

  for (let i = 0; i < numbers.length - 1; i++) {
    const diff = numbers[i + 1] - numbers[i];
    const diffAbs = Math.abs(diff);
    if (diffAbs < 1 || diffAbs > 3) {
      return false;
    }
    if ((diff > 0 && decreasing) || (diff < 0 && !decreasing)) {
      return false;
    }
  }
  return true;
};

line: for (const line of lines) {
  const numbers = line.split(" ").map((number) => parseInt(number, 10));

  if (verifyLine(numbers)) {
    safe += 1;
    continue line;
  }

  for (let i = 0; i < numbers.length; i++) {
    if (verifyLine(numbers.toSpliced(i, 1))) {
      safe += 1;
      continue line;
    }
  }
}

console.log(safe);

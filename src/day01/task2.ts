const input = Bun.file("./input.txt");

const text = await input.text();

const lines = text.split("\n");

const numbersLeft = [];
const numbersRight = new Map<number, number>();

for (const [left, right] of lines.map((line) => line.split("   "))) {
  const leftInt = parseInt(left, 10);
  const rightInt = parseInt(right, 10);

  numbersLeft.push(leftInt);
  numbersRight.set(
    rightInt,
    numbersRight.has(rightInt) ? numbersRight.get(rightInt)! + 1 : 1
  );
}

let sum = 0;

for (const left of numbersLeft) {
  const times = numbersRight.get(left) ?? 0;
  const partialSum = left * times;
  sum += partialSum;
}

console.log(sum);

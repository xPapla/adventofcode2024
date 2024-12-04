const input = Bun.file("./input.txt");

const text = await input.text();

const lines = text.split("\n");

const numbersLeft = [];
const numbersRight = [];

for (const [left, right] of lines.map((line) => line.split("   "))) {
  numbersLeft.push(parseInt(left, 10));
  numbersRight.push(parseInt(right, 10));
}

numbersLeft.sort((a, b) => a - b);
numbersRight.sort((a, b) => a - b);

let sum = 0;

for (let i = 0; i < numbersLeft.length; i++) {
  const left = numbersLeft[i];
  const right = numbersRight[i];
  const diff = Math.abs(left - right);
  sum += diff;
}

console.log(sum);

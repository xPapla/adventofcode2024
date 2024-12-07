const input = Bun.file("./input.txt");

const text = await input.text();

const lines = text.split("\n");

const OPERATOR = [
  (a: number, b: number) => a + b, // add
  (a: number, b: number) => a * b, // multiply
];

const verifyLine = (result: number, numbers: number[]): boolean => {
  // try all operators
  const base = OPERATOR.length;
  const len = numbers.length;
  const max = Math.pow(base, len - 1);

  for (let curr = 0; curr < max; curr++) {
    let outcome = numbers[0];
    for (let i = 0; i < len - 1; i++) {
      if (outcome > result) {
        break;
      }
      // same as (curr >> i) & 1 for 2 operators
      const operatorIndex = Math.floor(curr / Math.pow(base, i)) % base;

      const operator = OPERATOR[operatorIndex];
      outcome = operator(outcome, numbers[i + 1]);
    }

    if (outcome === result) {
      return true;
    }
  }
  return false;
};

let sum = 0;

for (const [resultStr, numbersStr] of lines.map((line) => line.split(": "))) {
  const result = parseInt(resultStr, 10);
  const numbers = numbersStr.split(" ").map((n) => parseInt(n, 10));
  const isValid = verifyLine(result, numbers);

  console.log(
    `${result} = ${numbers.join(" ")} => ${isValid ? "valid" : "invalid"}`
  );
  if (isValid) {
    sum += result;
  }
}

console.log(sum);

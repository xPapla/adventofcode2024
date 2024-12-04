const input = Bun.file("./input.txt");

const text = await input.text();

let sum = 0;
let enabled = true;
let textLeft = text;

const CONSTANTS = {
  DO: "do()",
  DONT: "don't()",
};

while (true) {
  const mulRegex = /mul\((?<left>\d{1,3}),(?<right>\d{1,3})\)/gm;

  const nextMulIndex = textLeft.search(mulRegex);
  if (nextMulIndex === -1) {
    break;
  }
  // mul exists

  if (enabled) {
    const nextDontIndex = textLeft.indexOf(CONSTANTS.DONT);
    if (nextDontIndex !== -1 && nextDontIndex < nextMulIndex) {
      // dont found before mul
      enabled = false;
      textLeft = textLeft.slice(nextDontIndex + CONSTANTS.DONT.length);
      continue;
    } else {
      const match = mulRegex.exec(textLeft)!;
      const left = parseInt(match.groups!.left, 10);
      const right = parseInt(match.groups!.right, 10);
      const partialResult = left * right;
      sum += partialResult;
      textLeft = textLeft.slice(nextMulIndex + match[0].length);
    }
  } else {
    // we dont care about mul
    const nextDoIndex = textLeft.indexOf(CONSTANTS.DO);
    if (nextDoIndex === -1) {
      break;
    }
    enabled = true;
    textLeft = textLeft.slice(nextDoIndex + CONSTANTS.DO.length);
  }
}

console.log(sum);

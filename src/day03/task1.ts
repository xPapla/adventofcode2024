const input = Bun.file("./input.txt");

const text = await input.text();

const regex = /mul\((?<left>\d{1,3}),(?<right>\d{1,3})\)/gm;

let sum = 0;

while (true) {
  const match = regex.exec(text);
  if (!match) {
    break;
  }

  const left = parseInt(match.groups!.left, 10);
  const right = parseInt(match.groups!.right, 10);

  const partialResult = left * right;

  sum += partialResult;
}

console.log(sum);

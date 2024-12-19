console.time("task1");
const input = Bun.file("./input.txt");

const text = await input.text();

const readLine = (() => {
  const lines = text.split("\n");
  let index = 0;
  return () => lines[index++];
})();

const towels = readLine().split(", ");
readLine();
const patterns: string[] = [];
while (true) {
  const line = readLine();
  if (line === undefined) {
    break;
  }
  patterns.push(line);
}

const isPossible = (testedPattern: string) => {
  if (testedPattern === "") {
    return true;
  }

  for (const towel of towels) {
    if (testedPattern.startsWith(towel)) {
      if (isPossible(testedPattern.slice(towel.length))) {
        return true;
      }
    }
  }

  return false;
};

let sum = 0;
for (const pattern of patterns) {
  if (isPossible(pattern)) {
    sum++;
  }
}
console.log(sum);
console.timeEnd("task1");

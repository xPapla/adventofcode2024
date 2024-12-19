console.time("task2");
const input = Bun.file("./input.txt");

const text = await input.text();

const readLine = (() => {
  const lines = text.split("\n");
  let index = 0;
  return () => lines[index++];
})();

const towels = readLine().split(", ").sort();
readLine();
const patterns: string[] = [];
while (true) {
  const line = readLine();
  if (line === undefined) {
    break;
  }
  patterns.push(line);
}

const cache = new Map<string, number>();

const countPossible = (testedPattern: string) => {
  if (cache.has(testedPattern)) {
    return cache.get(testedPattern)!;
  }

  if (testedPattern === "") {
    return 1;
  }

  let count = 0;
  for (const towel of towels) {
    if (testedPattern.startsWith(towel)) {
      const newTestedPattern = testedPattern.slice(towel.length);
      count += countPossible(newTestedPattern);
    }
  }

  cache.set(testedPattern, count);
  return count;
};

let sum = 0;
for (const pattern of patterns) {
  sum += countPossible(pattern);
}
console.log(sum);
console.timeEnd("task2");

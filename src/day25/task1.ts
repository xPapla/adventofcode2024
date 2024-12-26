const input = Bun.file("./input.txt");

const text = await input.text();

const things = text.split("\n\n");

const locks: number[][] = [];
const keys: number[][] = [];

for (const thing of things) {
  const lines = thing.split("\n");
  const hashCounts = [0, 0, 0, 0, 0];
  for (let y = 1; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      hashCounts[x] += line[x] === "#" ? 1 : 0;
    }
  }
  if (lines[0] === "#####") {
    locks.push(hashCounts);
  } else if (lines[0] === ".....") {
    keys.push(hashCounts.map((count) => count - 1));
  }
}

const canUnlock = (lock: number[], key: number[]) =>
  lock.every((count, i) => count + key[i] <= 5);

let count = 0;

for (const key of keys) {
  for (const lock of locks) {
    if (canUnlock(lock, key)) {
      console.log("For lock", lock, "key", key);
      count++;
    }
  }
}

console.log(count);

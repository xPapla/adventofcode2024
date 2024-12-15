const input = Bun.file("./input.txt");

const text = await input.text();

const stones = text.split(" ").map((v) => parseInt(v, 10));

const splitInHalf = (num: number) => {
  const str = num.toString();
  const half = Math.floor(str.length / 2);
  return [parseInt(str.slice(0, half), 10), parseInt(str.slice(half), 10)];
};

const processStonesOnce = (stones: number[]) => {
  return stones.flatMap((stone) =>
    stone === 0
      ? [1]
      : stone.toFixed(0).length % 2 === 0
      ? splitInHalf(stone)
      : [stone * 2024]
  );
};

const processStone25 = (stone: number) => {
  let temp = [stone];
  for (let i = 0; i < 25; i++) {
    temp = processStonesOnce(temp);
  }
  // pack to map
  const stonesCounts = new Map<number, number>();
  temp.forEach((stone) => {
    if (stonesCounts.has(stone)) {
      stonesCounts.set(stone, stonesCounts.get(stone)! + 1);
    } else {
      stonesCounts.set(stone, 1);
    }
  });

  return stonesCounts;
};

const processMap25 = (stones: Map<number, number>) => {
  const newStones = new Map<number, number>();

  stones.forEach((COUNT, stone) => {
    const processed = processStone25(stone);

    for (const [stone, count] of processed) {
      if (newStones.has(stone)) {
        newStones.set(stone, newStones.get(stone)! + count * COUNT);
      } else {
        newStones.set(stone, count * COUNT);
      }
    }
  });

  return newStones;
};

const count = (stones: Map<number, number>) => {
  let result = 0;
  stones.forEach((count) => {
    result += count;
  });
  return result;
};

const res = processMap25(
  processMap25(processMap25(new Map(stones.map((stone) => [stone, 1]))))
);

console.log(res);
console.log(count(res));

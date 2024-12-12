const input = Bun.file("./input.txt");

const text = await input.text();

const stones = text.split(" ").map((v) => parseInt(v, 10));

const splitInHalf = (num: number) => {
  const str = num.toString();
  const half = Math.floor(str.length / 2);
  return [parseInt(str.slice(0, half), 10), parseInt(str.slice(half), 10)];
};

const processStones = (stones: number[]) => {
  return stones.flatMap((stone) =>
    stone === 0
      ? [1]
      : stone.toFixed(0).length % 2 === 0
      ? splitInHalf(stone)
      : [stone * 2024]
  );
};

let result = stones;
for (let i = 0; i < 25; i++) {
  result = processStones(result);
}

console.log(result);
console.log(result.length);

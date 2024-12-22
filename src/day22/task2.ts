const input = Bun.file("./input.txt");

const text = await input.text();

const initialSeeds = text.split("\n").map(Number);

const modulo = (value: number, mod: number) => ((value % mod) + mod) % mod;

function* rand(seed: number) {
  let value = seed;

  while (true) {
    value = modulo(value ^ (value * 64), 16777216);
    value = modulo(value ^ Math.floor(value / 32), 16777216);
    value = modulo(value ^ (value * 2048), 16777216);
    yield value;
  }
}

const sequencesForSeeds = initialSeeds.map((seed) => {
  const r = rand(seed);
  const sequencesToValue = new Map<
    `${number},${number},${number},${number}`,
    number
  >();

  const recentValues = [0, 0, 0, 0, seed];
  for (let i = 0; i < 2000; i++) {
    const value = r.next().value!;
    recentValues.shift();
    recentValues.push(value);

    if (i < 3) {
      continue;
    }

    let priceDiffs: number[] = [];
    const prices = recentValues.map((v) => modulo(v, 10));
    for (let i = 1; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      priceDiffs.push(diff);
    }
    const currentPrice = prices[prices.length - 1];

    const key = priceDiffs.join(
      ","
    ) as `${number},${number},${number},${number}`;

    if (!sequencesToValue.has(key)) {
      sequencesToValue.set(key, currentPrice);
    }
  }

  return sequencesToValue;
});

const sumForAllSequences = new Map<
  `${number},${number},${number},${number}`,
  number
>();
for (const sequences of sequencesForSeeds) {
  for (const [sequence, value] of sequences.entries()) {
    sumForAllSequences.set(
      sequence,
      (sumForAllSequences.get(sequence) ?? 0) + value
    );
  }
}

const bestSequence = sumForAllSequences.entries().reduce(
  (acc, [sequence, value]) => {
    if (value > acc.value) {
      return { sequence, value };
    }

    return acc;
  },
  { sequence: "", value: 0 }
);

console.log(bestSequence);

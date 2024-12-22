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

const runTimes = (seed: number, times: number) => {
  const r = rand(seed);

  if (times < 1) {
    throw new Error("times must be greater than 0");
  }

  for (let i = 0; i < times - 1; i++) {
    r.next();
  }

  return r.next().value!;
};

let sum = 0;
for (const seed of initialSeeds) {
  sum += runTimes(seed, 2000);
}
console.log(sum);

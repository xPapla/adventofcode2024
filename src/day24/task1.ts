const input = Bun.file("./input.txt");

const text = await input.text();

const [inputsStr, gatesStr] = text.split("\n\n");
const inputs = inputsStr.split("\n").map((line) => {
  const [name, value] = line.split(": ");
  return {
    name,
    value: value === "1",
  };
});

const cache = new Map<string, boolean>();
for (const input of inputs) {
  cache.set(input.name, input.value);
}

const calcMap = new Map<string, [string, string, string]>();

const calcThose: string[] = [];

const gates = gatesStr.split("\n").map((line) => {
  // ntg XOR fgs -> mjb
  const [inA, gate, inB, , outC] = line.split(" ");
  calcMap.set(outC, [inA, gate, inB]);

  if (outC.startsWith("z")) {
    calcThose.push(outC);
  }
});

const calc = (name: string): boolean => {
  if (cache.has(name)) {
    return cache.get(name)!;
  }
  const [inA, gate, inB] = calcMap.get(name)!;
  const valueA = calc(inA);
  const valueB = calc(inB);
  const valueC =
    gate === "XOR"
      ? valueA !== valueB
      : gate === "OR"
      ? valueA || valueB
      : valueA && valueB; // and
  cache.set(name, valueC);

  return valueC;
};

const result = calcThose
  .sort()
  .map(calc)
  .reduce((acc, value, index) => acc + (value ? 2 ** index : 0), 0);

console.log({ result });

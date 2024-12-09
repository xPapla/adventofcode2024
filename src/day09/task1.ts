const input = Bun.file("./input.txt");

const text = await input.text();

const enum TYPE {
  FILE = "FILE",
  SPACE = "SPACE",
}

type File = { type: TYPE.FILE; id: number; size: number };
type Space = { type: TYPE.SPACE; size: number };

function* makeReader() {
  let index = 0;
  while (index < text.length) {
    const char = text[index];
    const size = parseInt(char, 10);
    const type = index % 2 === 0 ? TYPE.FILE : TYPE.SPACE;

    yield type === TYPE.FILE
      ? ({ type, size, id: index / 2 } satisfies File)
      : ({ type, size } satisfies Space);

    index++;
  }
}

const forwardReader = makeReader();
const memory = Array.from(forwardReader);

const asRaw = (memory: (File | Space)[]) => {
  const raw: (number | null)[] = [];

  for (const item of memory) {
    for (let i = 0; i < item.size; i++) {
      raw.push(item.type === TYPE.FILE ? item.id : null);
    }
  }
  return raw;
};

const printRawMemory = (rawMemory: (number | null)[]) => {
  console.log(rawMemory.map((v) => (v === null ? "." : v)).join(""));
};

const rawMemory = asRaw(memory);

const compactedMemory: number[] = [];
let backwardIndex = rawMemory.length - 1;

for (let i = 0; i < rawMemory.length; i++) {
  if (i > backwardIndex) {
    break;
  }

  const value = rawMemory[i];
  if (value !== null) {
    compactedMemory.push(value);
    continue;
  }

  while (rawMemory[backwardIndex] === null) {
    backwardIndex -= 1;
  }

  compactedMemory.push(rawMemory[backwardIndex]!);
  backwardIndex -= 1;
}

const checksum = compactedMemory.reduce(
  (acc, curr, index) => acc + index * curr,
  0
);

printRawMemory(compactedMemory);
console.log(checksum);

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

const printMemory = (memory: (File | Space)[]) => {
  printRawMemory(asRaw(memory));
};

const compactedMemory = memory.slice();
// 1-pass backward
for (const item of memory.toReversed()) {
  // printMemory(acc);
  if (item.type === TYPE.SPACE) {
    continue;
  }

  const file = item;
  const newSpaceIndex = compactedMemory.findIndex(
    (item) => item.type === TYPE.SPACE && item.size >= file.size
  );
  const fileIndex = compactedMemory.findIndex(
    (item) => item.type === TYPE.FILE && item.id === file.id
  );

  if (newSpaceIndex === -1 || newSpaceIndex > fileIndex) {
    continue;
  }

  const space = compactedMemory[newSpaceIndex] as Space;

  // move file to space (it can be smaller than the space so keep the rest of space)
  compactedMemory.splice(fileIndex, 1, {
    type: TYPE.SPACE,
    size: file.size,
  });

  compactedMemory.splice(newSpaceIndex, 1, file, {
    type: TYPE.SPACE,
    size: space.size - file.size,
  });

  // join spaces? (not needed, lucky?)
}

const raw = asRaw(compactedMemory);
const checksum = raw.reduce<number>((acc, curr, index) => {
  if (curr === null) {
    return acc;
  }

  return acc + index * curr;
}, 0);

printMemory(compactedMemory);
console.log(checksum);

console.time("task1");
const input = Bun.file("./input.txt");

const text = await input.text();

const edges = text
  .split("\n")
  .map((line) => line.split("-") as [string, string]);

const indexCache = new Map<string, number>();

const getIndexFor = (vertex: string) => {
  if (indexCache.has(vertex)) {
    return indexCache.get(vertex)!;
  }

  const newIndex = indexCache.size;
  indexCache.set(vertex, newIndex);
  return newIndex;
};

for (const [v1, v2] of edges) {
  getIndexFor(v1);
  getIndexFor(v2);
}

const entries = new Map<number, string>(
  [...indexCache.entries()].map(([key, value]) => [value, key])
);
const getVertexFor = (index: number) => entries.get(index)!;

const vertices = indexCache.size;
const matrix = [...new Array(vertices)].map(() =>
  new Array(vertices).fill(0)
) as number[][];

for (const [v1, v2] of edges) {
  const i1 = getIndexFor(v1);
  const i2 = getIndexFor(v2);
  matrix[i1][i2]++;
  matrix[i2][i1]++;
}

// console.log(`matrix:
// ${matrix.map((row) => row.join("")).join("\n")}`);
// console.log(indexCache);

let count = 0;
for (let i = 0; i < matrix.length; i++) {
  for (let j = i + 1; j < matrix.length; j++) {
    if (!matrix[i][j]) {
      continue;
    }
    for (let k = j + 1; k < matrix.length; k++) {
      if (matrix[i][k] && matrix[j][k]) {
        const anyStartsWithT = [i, j, k].some((index) =>
          getVertexFor(index).startsWith("t")
        );
        if (anyStartsWithT) {
          count++;
        }
      }
    }
  }
}

console.log(count);
console.timeEnd("task1");

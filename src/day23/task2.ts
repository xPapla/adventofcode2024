console.time("task2");
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
// ${matrix
//   .map(
//     (row, index) =>
//       row.join("") +
//       " " +
//       getVertexFor(index) +
//       " " +
//       row.reduce((acc, curr) => acc + curr, 0)
//   )
//   .join("\n")}`);
// console.log(matrix.length);

const bronKerbosch = (R: number[], P: number[], X: number[]): number[] => {
  if (P.length === 0 && X.length === 0) {
    return R;
  }

  let largest: number[] = [];

  for (const v of P) {
    const newR = [...R, v];
    const newP = P.filter((p) => matrix[v][p] === 1);
    const newX = X.filter((x) => matrix[v][x] === 1);

    const result = bronKerbosch(newR, newP, newX);

    if (result.length > largest.length) {
      largest = result;
    }

    P = P.filter((p) => p !== v);
    X = [...X, v];
  }

  return largest;
};
const largest = bronKerbosch([], [...new Array(vertices).keys()], []);

console.log(
  largest
    .map((index) => getVertexFor(index))
    .sort()
    .join(",")
);
console.timeEnd("task2");

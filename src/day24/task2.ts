const input = Bun.file("./input.txt");

const text = await input.text();

const [, gatesStr] = text.split("\n\n");

const gates = gatesStr
  .split("\n")
  .map((line) => line.split(" "))
  .sort(
    ([inA1, gate1, inB1, , outC1], [inA2, gate2, inB2, , outC2]) =>
      -gate1.localeCompare(gate2) || inA1.localeCompare(inA2)
  );

const swapGatesOutputs = (name1: string, name2: string) => {
  for (const gate of gates) {
    if (gate[4] === name1) {
      gate[4] = name2;
    } else if (gate[4] === name2) {
      gate[4] = name1;
    }
  }
};

swapGatesOutputs("z15", "jgc");
swapGatesOutputs("drg", "z22");
swapGatesOutputs("gvw", "qjb");
swapGatesOutputs("jbp", "z35");

const output = `digraph G {
graph [nodesep=0.5, ranksep=0.75]; // Adjust spacing here
rankdir=LR;
  ${gates
    .map(
      ([inA, gate, inB, , outC], index) =>
        `
${inA} [label="${inA}"];
${inB} [label="${inB}"];
${gate}${index} [label="${gate}"];
${inA} -> ${gate}${index};
${inB} -> ${gate}${index};
${gate}${index} -> ${outC};
`
    )
    .join("\n")}
}`;

console.log(output);

// bun run task2.ts > graph.dot && dot -Kdot -Tpng graph.dot -o graph_dot.png

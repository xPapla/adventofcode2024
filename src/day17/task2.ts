import { Worker, isMainThread, parentPort, workerData } from "worker_threads";

const input = Bun.file("./input.txt");

const text = await input.text();

const readLine = (() => {
  const lines = text.split("\n");
  let index = 0;
  return () => lines[index++];
})();

const validate = (
  initRegA: number,
  initRegB: number,
  initRegC: number,
  instructions: number[]
) => {
  const output: number[] = [];

  try {
    let registerA = initRegA;
    let registerB = initRegB;
    let registerC = initRegC;
    let instructionPointer = 0;

    const readInstruction = () => {
      if (instructionPointer >= instructions.length) {
        halt();
      }
      return instructions[instructionPointer];
    };
    const readNextInstruction = () => {
      instructionPointer += 1;
      const value = readInstruction();
      instructionPointer -= 1;
      return value;
    };
    const unwrapComboOperand = (value: number) => {
      switch (value) {
        case 0:
        case 1:
        case 2:
        case 3:
          return value;
        case 4:
          return registerA;
        case 5:
          return registerB;
        case 6:
          return registerC;
        default:
          throw "INVALID COMBO OPERAND";
      }
    };

    const DEFAULT_INCREMENT = 2;

    const halt = () => {
      throw "HALT";
    };
    const unknownInstruction = () => {
      throw "UNKNOWN INSTRUCTION";
    };

    const INSTRUCTIONS = {
      [0 /* adv */]: (combo: number) => {
        const operand = unwrapComboOperand(combo);

        const numerator = registerA;
        const denominator = Math.pow(2, operand);
        registerA = Math.floor(numerator / denominator);
      },
      [1 /* bxl */]: (literal: number) => {
        registerB = registerB ^ literal;
      },
      [2 /* bst */]: (combo: number) => {
        registerB = ((unwrapComboOperand(combo) % 8) + 8) % 8;
      },
      [3 /* jnz */]: (literal: number) => {
        if (registerA !== 0) {
          instructionPointer = literal - DEFAULT_INCREMENT;
        }
      },
      [4 /* bxc */]: (ignore: number) => {
        registerB = registerB ^ registerC;
      },
      [5 /* out */]: (combo: number) => {
        const operand = ((unwrapComboOperand(combo) % 8) + 8) % 8;
        output.push(operand);
      },
      [6 /* bdv */]: (combo: number) => {
        const operand = unwrapComboOperand(combo);

        const numerator = registerA;
        const denominator = Math.pow(2, operand);
        registerB = Math.floor(numerator / denominator);
      },
      [7 /* cdv */]: (combo: number) => {
        const operand = unwrapComboOperand(combo);

        const numerator = registerA;
        const denominator = Math.pow(2, operand);
        registerC = Math.floor(numerator / denominator);
      },
    };

    while (true) {
      const opcode = readInstruction();
      if (!Object.keys(INSTRUCTIONS).includes(opcode.toString())) {
        unknownInstruction();
      }
      INSTRUCTIONS[opcode as keyof typeof INSTRUCTIONS](readNextInstruction());
      instructionPointer += DEFAULT_INCREMENT;
    }
  } catch (e) {
    if (e === "HALT") {
      return output;
    }
    throw e;
  }
};

readLine();
const registerA = 0;
const registerB = parseInt(readLine().split(": ")[1], 10);
const registerC = parseInt(readLine().split(": ")[1], 10);
readLine();
const instructions = readLine().split(": ")[1].split(",").map(Number);

// for (let a = start; a < end; a++) {
// if (validate(a, registerB, registerC, instructions)) {
// console.log(`Valid register A: ${a} (${workerIndex})`);
// parentPort?.postMessage(`Valid register A: ${a} (${workerIndex})`);
// } else {
// parentPort?.postMessage(`Invalid register A: ${a}`);
// }
// }
const aValues = [
  //
  7, 2, 6, 6,
  //
  1, 6, 3, 0,
  //
  6, 7, 5, 0,
  //
  3, 2, 0, 5,
];

const seen = new Map<number, number[]>();

let lowestIncorrectPair: [number, number[]] | null = null;

const expected = instructions;

while (true) {
  aValues[0] = 0b111;
  aValues[1] = 0b100;
  aValues[2] = 0b110;
  aValues[3] = 0b001;
  aValues[4] = 0b001;
  aValues[5] = 0b110;
  aValues[6] = 0b000;
  aValues[7] = 0b101;
  aValues[8] = 0b010;
  aValues[9] = 0b010;
  aValues[10] = 0b110;
  aValues[11] = 0b010;

  const a = parseInt(
    aValues.reduce(
      (acc, value, index) => `${acc}${value.toString(2).padStart(3, "0")}`,
      ""
    ),
    2
  );

  if (seen.has(a)) {
    const actual = seen.get(a)!;
    const incorrectIndexes = actual
      .map((value, index) => (value !== expected[index] ? index : -1))
      .filter((index) => index !== -1);

    let randomIncorrectIndex =
      incorrectIndexes[Math.floor(Math.random() * incorrectIndexes.length)];

    if (Math.random() > 0.5) {
      randomIncorrectIndex = Math.max(
        0,
        Math.min(randomIncorrectIndex + Math.floor(Math.random() * 3) - 1, 15)
      );
    }

    aValues[15 - randomIncorrectIndex] = Math.floor(Math.random() * 8);
    continue;
  }
  console.log(a.toString(2));

  const actual = validate(a, registerB, registerC, instructions);
  const diff = actual
    .map((num, index) => (num === expected[index] ? " " : "^"))
    .join(" ");

  console.log(expected.join(","));
  console.log(actual.join(","));
  console.log(diff);
  seen.set(a, actual);

  const brokenCount = expected.reduce(
    (acc, num, index) => (num === actual[index] ? acc : acc + 1),
    0
  );
  console.log(brokenCount);

  if (lowestIncorrectPair === null || brokenCount < lowestIncorrectPair[0]) {
    lowestIncorrectPair = [brokenCount, aValues];
  }

  const modifyIndex = actual.findIndex(
    (value, index) => value !== expected[index]
  );

  // if ()

  // if (Math.random() > 0.5) {
  //   modifyIndex = modifyIndex !== -1 ? modifyIndex + 1 : -1;
  // } else if (Math.random() > 0.5) {
  //   modifyIndex = modifyIndex !== -1 ? modifyIndex - 1 : -1;
  // }
  // : actual.findLastIndex((value, index) => value !== expected[index]);
  console.log(modifyIndex);
  console.log(
    `${lowestIncorrectPair?.[0]} ${lowestIncorrectPair?.[1].join(",")}`
  );

  console.log("\n\n");

  if (brokenCount === 0) {
    break;
  }

  if (modifyIndex === -1) {
    break;
  }

  const oldValue = aValues[15 - modifyIndex];
  const newValue = (oldValue + 1 + 8) % 8;
  aValues[15 - modifyIndex] = newValue;

  // seen.add(a);
}

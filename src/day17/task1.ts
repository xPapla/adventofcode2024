const input = Bun.file("./input.txt");

const text = await input.text();

const readLine = (() => {
  const lines = text.split("\n");
  let index = 0;
  return () => lines[index++];
})();

let registerA = parseInt(readLine().split(": ")[1], 10);
let registerB = parseInt(readLine().split(": ")[1], 10);
let registerC = parseInt(readLine().split(": ")[1], 10);
readLine();
const instructions = readLine().split(": ")[1].split(",").map(Number);
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

// opcode (3 bit), operand (3 bit)
const DEFAULT_INCREMENT = 2;

let buffer = "";

const halt = () => {
  console.log(buffer);
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
    registerB = unwrapComboOperand(combo) % 8;
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
    const operand = unwrapComboOperand(combo) % 8;
    buffer += `${operand},`;
    console.log(operand);
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

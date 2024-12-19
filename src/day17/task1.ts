const input = Bun.file("./input.txt");

const text = await input.text();

const readLine = (() => {
  const lines = text.split("\n");
  let index = 0;
  return () => lines[index++];
})();
readLine();
///////////////// 0         0         0         0         0         0         0         0
///////////////// 01234567890123456789012345678901234567890123456789012345678901234567890
// Program:       2  4  1  7  7  5  0  3  4  4  1  7  5  5  3  0
///////////////// 111222333444555666777888999000111222333444555666777888999000111222333444
/**
 * 000 = 7
 * 001 = 6
 * 010 = 5
 * 011 = 4
 * 100 = 3
 * 101 = 2
 * 110 = 1
 * 111 = 0
 */
///////////////// XXX   XXX   XXX   XXX   XXX   XXX   XXX   XXX
// Program rev:   0  3  5  5  7  1  4  4  3  0  5  7  7  1  4  2
let registerA = 0b111100110001001110000101010010110010111000010010;

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

const buffer: number[] = [];

const halt = () => {
  const a = instructions.join(",  ");
  const b = Array.from(
    { length: instructions.length - buffer.length },
    () => " "
  )
    .join(",  ")
    .concat(
      instructions.length - buffer.length === 0 ? "" : ",  ",
      buffer.join(",  ")
    );

  console.log(a);
  console.log(b);

  // diff
  console.log(
    a
      .split("")
      .map((char, index) => (char === b[index] ? " " : "^"))
      .join("")
  );

  const c = instructions.map((i) => i.toString(2).padStart(3, "0")).join(" ");
  console.log(c);
  const d = Array.from(
    { length: instructions.length - buffer.length },
    () => " "
  )
    .join(" ")
    .concat(
      instructions.length - buffer.length === 0 ? "" : " ",
      buffer.map((i) => i.toString(2).padStart(3, "0")).join(" ")
    );
  console.log(d);

  // diff
  console.log(
    c
      .split("")
      .map((char, index) => (char === d[index] ? " " : "^"))
      .join("")
  );

  console.log({ length: buffer.length, expected: instructions.length });

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
    const operand = ((unwrapComboOperand(combo) % 8) + 8) % 8;
    buffer.push(operand);
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

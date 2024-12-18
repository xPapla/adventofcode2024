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
  const addToOutput = (value: number) => {
    output.push(value);
    // verify as soon as possible
    const stillValid = output.every((value, index) => {
      return instructions[index] === value;
    });
    if (!stillValid) {
      throw "INVALID OUTPUT";
    }
  };

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
        addToOutput(operand);
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
      return output.length === instructions.length;
    }
    if (e === "INVALID OUTPUT") {
      return false;
    }
    throw e;
  }
};

const registerA = parseInt(readLine().split(": ")[1], 10);
const registerB = parseInt(readLine().split(": ")[1], 10);
const registerC = parseInt(readLine().split(": ")[1], 10);
readLine();
const instructions = readLine().split(": ")[1].split(",").map(Number);

if (isMainThread) {
  const MIN = Math.pow(2, 27);
  const MAX = Math.pow(2, 28); //Number.MAX_SAFE_INTEGER;
  const numWorkers = 6;
  const workers: Worker[] = [];
  const range = Math.ceil((MAX - MIN) / numWorkers);
  let checked = 0;
  let lastTimestamp = Date.now();

  for (let i = 0; i < numWorkers; i++) {
    workers.push(
      new Worker(__filename, {
        workerData: {
          workerIndex: i,
          start: MIN + i * range,
          end: MIN + (i + 1) * range,
          registerB,
          registerC,
          instructions,
        },
      })
    );
  }

  workers.forEach((worker) => {
    worker.on("message", (message) => {
      checked += 1;
      // last1000timestamps.push(Date.now());
      // if (last1000timestamps.length > 1000) {
      //   last1000timestamps.shift();
      // }

      if (message.startsWith("Valid")) {
        console.log(message);
        console.log(message);
        console.log(message);
        console.log(message);
        workers.forEach((worker) => {
          worker.terminate();
        });
      }

      if (checked % 5000 === 0) {
        const now = Date.now();
        console.log(
          `Progress: ${checked}/${MAX - MIN} (${(
            (checked / (MAX - MIN)) *
            100
          ).toFixed(10)}%) Avg. speed: ${(
            5000 /
            ((now - lastTimestamp) / 1000)
          ).toFixed(2)}/s`
        );

        lastTimestamp = now;
      }
    });
  });
} else {
  const { start, end, registerB, registerC, instructions, workerIndex } =
    workerData;

  for (let a = start; a < end; a++) {
    if (validate(a, registerB, registerC, instructions)) {
      console.log(`Valid register A: ${a} (${workerIndex})`);
      parentPort?.postMessage(`Valid register A: ${a} (${workerIndex})`);
    } else {
      parentPort?.postMessage(`Invalid register A: ${a}`);
    }
  }
}

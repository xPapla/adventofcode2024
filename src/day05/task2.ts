const input = Bun.file("./input.txt");

const text = await input.text();

const rulesEnd = text.indexOf("\n\n");

const rules = text.slice(0, rulesEnd).split("\n");
const updates = text.slice(rulesEnd + 2).split("\n");

const requirements = new Map<string, Set<string>>();

const addRequirement = (forPage: string, required: string) => {
  requirements.set(
    forPage,
    (requirements.get(forPage) || new Set()).add(required)
  );
};

for (const rule of rules) {
  const [required, forPage] = rule.split("|");
  addRequirement(forPage, required);
}

const verifyUpdate = (update: string[]) => {
  for (let i = 0; i < update.length; i++) {
    const current = update[i];
    const allNext = update.slice(i + 1);

    const requirementsForCurrent = requirements.get(current)!;

    if (allNext.some((next) => requirementsForCurrent.has(next))) {
      return false;
    }
  }

  return true;
};

let sum = 0;

for (const update of updates) {
  let updateParts = update.split(",");

  const result = verifyUpdate(updateParts);
  if (result) {
    continue;
  }

  updateParts = updateParts.sort((a, b) =>
    requirements.get(a)!.has(b) ? 1 : -1
  );

  if (!verifyUpdate(updateParts)) {
    throw new Error("Still not valid");
  }

  const middle = Math.floor(updateParts.length / 2);
  if (updateParts.length % 2 === 0) {
    throw new Error("Not an even number of parts");
  }
  const middlePart = updateParts[middle];

  sum += parseInt(middlePart, 10);
}

console.log(sum);

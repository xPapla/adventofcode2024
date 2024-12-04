const input = Bun.file("./input.txt");

const text = await input.text();

const lines = text.split("\n");

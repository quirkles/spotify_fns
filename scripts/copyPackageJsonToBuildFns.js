/* eslint-disable @typescript-eslint/no-var-requires */

const { readFileSync, readdirSync, writeFileSync } = require("fs");
const { join } = require("path");
const { mergeDeepRight } = require("ramda");

const packageJson = JSON.parse(
  readFileSync(join(__dirname, "..", "package.json")).toString("utf-8")
); //eslint-disable-line

const fns = readdirSync(join(__dirname, "..", "dist"), {
  withFileTypes: true,
})
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

for (const fn of fns) {
  const fnDir = join(__dirname, "..", "dist", fn);
  const jsonToWrite = mergeDeepRight(packageJson, {
    name: fn.toLowerCase(),
    main: "function.js",
  });
  writeFileSync(
    join(fnDir, "package.json"),
    JSON.stringify(jsonToWrite, null, 2)
  );
  console.log(fnDir) //eslint-disable-line
}

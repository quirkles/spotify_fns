/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const fs = require("fs");

const distFns = path.join(__dirname, "build/fns");

const entries = fs
  .readdirSync(distFns, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .reduce((map, dirent) => {
    map[dirent.name] = path.join(distFns, dirent.name, "fn/index.js");
    return map;
  }, {});

// console.log(entries) //eslint-disable-line

module.exports = {
  mode: "production",
  target: "node",
  entry: entries,
  output: {
    filename: "[name]/function.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs2",
  },
};

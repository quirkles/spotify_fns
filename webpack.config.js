/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const fs = require("fs");
const nodeExternals = require("webpack-node-externals");

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
  externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  entry: entries,
  output: {
    filename: "[name]/function.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs2",
  },
  devtool: "eval-source-map",
};

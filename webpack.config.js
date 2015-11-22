"use strict";

let packageJson = require("./package.json");
let webpack     = require("webpack");
let nodeStatic  = require("node-static");
let http        = require("http");

const dev       = process.env.NODE_ENV !== "production";
const namespace = "Roller";
const version   = packageJson.version;
const name      = packageJson.name;

module.exports = {

  entry: "./src/entry",
  output: {
    path: __dirname + "/dist",
    filename: `${name}.min.js`,
    library: namespace
  },
  resolve: {
    modulesDirectories: ["node_modules"],
    extensions: [".js"]
  },
  plugins: [],
  watch: dev,
  devtool: dev ? "cheap-module-inline-source-map" : null

};

// minification
if (!dev) {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

// static server for testing
if (dev) {
  let server = new nodeStatic.Server();

  http.createServer((req, res) => {

    req.addListener("end", () => {
      server.serve(req, res);
    }).resume();

  }).listen(8080);
}

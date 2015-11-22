"use strict";

var polyfill = require("./polyfills/customEvent");

polyfill();
module.exports = require("./classes/Roller");

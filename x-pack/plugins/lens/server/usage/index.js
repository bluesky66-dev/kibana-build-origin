"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _collectors = require("./collectors");

Object.keys(_collectors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _collectors[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _collectors[key];
    }
  });
});

var _task = require("./task");

Object.keys(_task).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _task[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _task[key];
    }
  });
});
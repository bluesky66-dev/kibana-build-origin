"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _highlights = require("./highlights");

Object.keys(_highlights).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _highlights[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _highlights[key];
    }
  });
});

var _summary = require("./summary");

Object.keys(_summary).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _summary[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _summary[key];
    }
  });
});

var _summary_highlights = require("./summary_highlights");

Object.keys(_summary_highlights).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _summary_highlights[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _summary_highlights[key];
    }
  });
});
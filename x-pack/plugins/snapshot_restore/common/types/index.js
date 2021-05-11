"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _repository = require("./repository");

Object.keys(_repository).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _repository[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _repository[key];
    }
  });
});

var _snapshot = require("./snapshot");

Object.keys(_snapshot).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _snapshot[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _snapshot[key];
    }
  });
});

var _restore = require("./restore");

Object.keys(_restore).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _restore[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _restore[key];
    }
  });
});

var _policy = require("./policy");

Object.keys(_policy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _policy[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _policy[key];
    }
  });
});

var _indices = require("./indices");

Object.keys(_indices).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _indices[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _indices[key];
    }
  });
});
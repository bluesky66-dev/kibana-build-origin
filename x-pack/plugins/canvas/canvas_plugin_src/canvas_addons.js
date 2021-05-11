"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _datasources = require("./uis/datasources");

Object.keys(_datasources).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _datasources[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _datasources[key];
    }
  });
});

var _elements = require("./elements");

Object.keys(_elements).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _elements[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _elements[key];
    }
  });
});

var _models = require("./uis/models");

Object.keys(_models).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _models[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _models[key];
    }
  });
});

var _views = require("./uis/views");

Object.keys(_views).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _views[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _views[key];
    }
  });
});

var _arguments = require("./uis/arguments");

Object.keys(_arguments).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _arguments[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _arguments[key];
    }
  });
});

var _tags = require("./uis/tags");

Object.keys(_tags).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _tags[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tags[key];
    }
  });
});

var _transforms = require("./uis/transforms");

Object.keys(_transforms).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _transforms[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _transforms[key];
    }
  });
});
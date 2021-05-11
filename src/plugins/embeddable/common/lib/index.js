"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extract = require("./extract");

Object.keys(_extract).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _extract[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _extract[key];
    }
  });
});

var _inject = require("./inject");

Object.keys(_inject).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _inject[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _inject[key];
    }
  });
});

var _migrate = require("./migrate");

Object.keys(_migrate).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _migrate[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _migrate[key];
    }
  });
});

var _migrate_base_input = require("./migrate_base_input");

Object.keys(_migrate_base_input).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _migrate_base_input[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _migrate_base_input[key];
    }
  });
});

var _telemetry = require("./telemetry");

Object.keys(_telemetry).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _telemetry[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _telemetry[key];
    }
  });
});

var _saved_object_embeddable = require("./saved_object_embeddable");

Object.keys(_saved_object_embeddable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _saved_object_embeddable[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _saved_object_embeddable[key];
    }
  });
});
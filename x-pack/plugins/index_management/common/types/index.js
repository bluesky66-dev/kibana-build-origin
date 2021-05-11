"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  DataStreamFromEs: true,
  Health: true,
  DataStream: true,
  DataStreamIndex: true
};
Object.defineProperty(exports, "DataStreamFromEs", {
  enumerable: true,
  get: function () {
    return _data_streams.DataStreamFromEs;
  }
});
Object.defineProperty(exports, "Health", {
  enumerable: true,
  get: function () {
    return _data_streams.Health;
  }
});
Object.defineProperty(exports, "DataStream", {
  enumerable: true,
  get: function () {
    return _data_streams.DataStream;
  }
});
Object.defineProperty(exports, "DataStreamIndex", {
  enumerable: true,
  get: function () {
    return _data_streams.DataStreamIndex;
  }
});

var _aliases = require("./aliases");

Object.keys(_aliases).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _aliases[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _aliases[key];
    }
  });
});

var _indices = require("./indices");

Object.keys(_indices).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _indices[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _indices[key];
    }
  });
});

var _mappings = require("./mappings");

Object.keys(_mappings).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _mappings[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mappings[key];
    }
  });
});

var _templates = require("./templates");

Object.keys(_templates).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _templates[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _templates[key];
    }
  });
});

var _data_streams = require("./data_streams");

var _component_templates = require("./component_templates");

Object.keys(_component_templates).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _component_templates[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _component_templates[key];
    }
  });
});
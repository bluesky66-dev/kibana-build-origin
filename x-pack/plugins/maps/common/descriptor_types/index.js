"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _data_request_descriptor_types = require("./data_request_descriptor_types");

Object.keys(_data_request_descriptor_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _data_request_descriptor_types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _data_request_descriptor_types[key];
    }
  });
});

var _source_descriptor_types = require("./source_descriptor_types");

Object.keys(_source_descriptor_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _source_descriptor_types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _source_descriptor_types[key];
    }
  });
});

var _layer_descriptor_types = require("./layer_descriptor_types");

Object.keys(_layer_descriptor_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _layer_descriptor_types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _layer_descriptor_types[key];
    }
  });
});

var _map_descriptor = require("./map_descriptor");

Object.keys(_map_descriptor).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _map_descriptor[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _map_descriptor[key];
    }
  });
});

var _style_property_descriptor_types = require("./style_property_descriptor_types");

Object.keys(_style_property_descriptor_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _style_property_descriptor_types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _style_property_descriptor_types[key];
    }
  });
});
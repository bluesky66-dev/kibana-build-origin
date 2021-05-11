"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "NodeTypes", {
  enumerable: true,
  get: function () {
    return _types.NodeTypes;
  }
});
Object.defineProperty(exports, "nodeBuilder", {
  enumerable: true,
  get: function () {
    return _node_builder.nodeBuilder;
  }
});
exports.nodeTypes = void 0;

var functionType = _interopRequireWildcard(require("./function"));

var literal = _interopRequireWildcard(require("./literal"));

var namedArg = _interopRequireWildcard(require("./named_arg"));

var wildcard = _interopRequireWildcard(require("./wildcard"));

var _types = require("./types");

var _node_builder = require("./node_builder");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const nodeTypes = {
  // This requires better typing of the different typings and their return types.
  // @ts-ignore
  function: functionType,
  literal,
  namedArg,
  wildcard
};
exports.nodeTypes = nodeTypes;
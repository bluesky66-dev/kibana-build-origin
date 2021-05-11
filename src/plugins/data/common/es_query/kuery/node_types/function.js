"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildNode = buildNode;
exports.buildNodeWithArgumentNodes = buildNodeWithArgumentNodes;
exports.toElasticsearchQuery = toElasticsearchQuery;

var _lodash = _interopRequireDefault(require("lodash"));

var _functions = require("../functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function buildNode(functionName, ...args) {
  const kueryFunction = _functions.functions[functionName];

  if (_lodash.default.isUndefined(kueryFunction)) {
    throw new Error(`Unknown function "${functionName}"`);
  }

  return {
    type: 'function',
    function: functionName,
    // This requires better typing of the different typings and their return types.
    // @ts-ignore
    ...kueryFunction.buildNodeParams(...args)
  };
} // Mainly only useful in the grammar where we'll already have real argument nodes in hand


function buildNodeWithArgumentNodes(functionName, args) {
  if (_lodash.default.isUndefined(_functions.functions[functionName])) {
    throw new Error(`Unknown function "${functionName}"`);
  }

  return {
    type: 'function',
    function: functionName,
    arguments: args
  };
}

function toElasticsearchQuery(node, indexPattern, config, context) {
  const kueryFunction = _functions.functions[node.function];
  return kueryFunction.toElasticsearchQuery(node, indexPattern, config, context);
}
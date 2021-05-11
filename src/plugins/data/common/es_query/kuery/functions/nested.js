"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildNodeParams = buildNodeParams;
exports.toElasticsearchQuery = toElasticsearchQuery;

var ast = _interopRequireWildcard(require("../ast"));

var literal = _interopRequireWildcard(require("../node_types/literal"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function buildNodeParams(path, child) {
  const pathNode = typeof path === 'string' ? ast.fromLiteralExpression(path) : literal.buildNode(path);
  return {
    arguments: [pathNode, child]
  };
}

function toElasticsearchQuery(node, indexPattern, config = {}, context = {}) {
  var _context$nested;

  const [path, child] = node.arguments;
  const stringPath = ast.toElasticsearchQuery(path);
  const fullPath = context !== null && context !== void 0 && (_context$nested = context.nested) !== null && _context$nested !== void 0 && _context$nested.path ? `${context.nested.path}.${stringPath}` : stringPath;
  return {
    nested: {
      path: fullPath,
      query: ast.toElasticsearchQuery(child, indexPattern, config, { ...context,
        nested: {
          path: fullPath
        }
      }),
      score_mode: 'none'
    }
  };
}
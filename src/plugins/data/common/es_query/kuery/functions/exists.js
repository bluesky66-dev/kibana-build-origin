"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildNodeParams = buildNodeParams;
exports.toElasticsearchQuery = toElasticsearchQuery;

var _lodash = require("lodash");

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
function buildNodeParams(fieldName) {
  return {
    arguments: [literal.buildNode(fieldName)]
  };
}

function toElasticsearchQuery(node, indexPattern, config = {}, context = {}) {
  const {
    arguments: [fieldNameArg]
  } = node;
  const fullFieldNameArg = { ...fieldNameArg,
    value: context !== null && context !== void 0 && context.nested ? `${context.nested.path}.${fieldNameArg.value}` : fieldNameArg.value
  };
  const fieldName = literal.toElasticsearchQuery(fullFieldNameArg);
  const field = (0, _lodash.get)(indexPattern, 'fields', []).find(fld => fld.name === fieldName);

  if (field && field.scripted) {
    throw new Error(`Exists query does not support scripted fields`);
  }

  return {
    exists: {
      field: fieldName
    }
  };
}
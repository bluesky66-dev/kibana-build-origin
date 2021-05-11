"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFields = getFields;

var literal = _interopRequireWildcard(require("../../node_types/literal"));

var wildcard = _interopRequireWildcard(require("../../node_types/wildcard"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getFields(node, indexPattern) {
  if (!indexPattern) return [];

  if (node.type === 'literal') {
    const fieldName = literal.toElasticsearchQuery(node);
    const field = indexPattern.fields.find(fld => fld.name === fieldName);

    if (!field) {
      return [];
    }

    return [field];
  } else if (node.type === 'wildcard') {
    const fields = indexPattern.fields.filter(fld => wildcard.test(node, fld.name));
    return fields;
  }
}
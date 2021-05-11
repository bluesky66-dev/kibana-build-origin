"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildNode = buildNode;
exports.test = test;
exports.toElasticsearchQuery = toElasticsearchQuery;
exports.toQueryStringQuery = toQueryStringQuery;
exports.hasLeadingWildcard = hasLeadingWildcard;
exports.wildcardSymbol = void 0;

var _ast = require("../ast/ast");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const wildcardSymbol = '@kuery-wildcard@'; // Copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

exports.wildcardSymbol = wildcardSymbol;

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
} // See https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#_reserved_characters


function escapeQueryString(str) {
  return str.replace(/[+-=&|><!(){}[\]^"~*?:\\/]/g, '\\$&'); // $& means the whole matched string
}

function buildNode(value) {
  if (!value.includes(wildcardSymbol)) {
    return (0, _ast.fromLiteralExpression)(value);
  }

  return {
    type: 'wildcard',
    value
  };
}

function test(node, str) {
  const {
    value
  } = node;
  const regex = value.split(wildcardSymbol).map(escapeRegExp).join('[\\s\\S]*');
  const regexp = new RegExp(`^${regex}$`);
  return regexp.test(str);
}

function toElasticsearchQuery(node) {
  const {
    value
  } = node;
  return value.split(wildcardSymbol).join('*');
}

function toQueryStringQuery(node) {
  const {
    value
  } = node;
  return value.split(wildcardSymbol).map(escapeQueryString).join('*');
}

function hasLeadingWildcard(node) {
  const {
    value
  } = node; // A lone wildcard turns into an `exists` query, so we're only concerned with
  // leading wildcards followed by additional characters.

  return value.startsWith(wildcardSymbol) && value.replace(wildcardSymbol, '').length > 0;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toElasticsearchQuery = exports.doesKueryExpressionHaveLuceneSyntaxError = exports.fromKueryExpression = exports.fromLiteralExpression = void 0;

var _index = require("../node_types/index");

var _kuery_syntax_error = require("../kuery_syntax_error");

var _kuery = require("./_generated_/kuery");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @ts-ignore
const fromExpression = (expression, parseOptions = {}, parse = _kuery.parse) => {
  if (typeof expression === 'undefined') {
    throw new Error('expression must be a string, got undefined instead');
  }

  return parse(expression, { ...parseOptions,
    helpers: {
      nodeTypes: _index.nodeTypes
    }
  });
};

const fromLiteralExpression = (expression, parseOptions = {}) => {
  return fromExpression(expression, { ...parseOptions,
    startRule: 'Literal'
  }, _kuery.parse);
};

exports.fromLiteralExpression = fromLiteralExpression;

const fromKueryExpression = (expression, parseOptions = {}) => {
  try {
    return fromExpression(expression, parseOptions, _kuery.parse);
  } catch (error) {
    if (error.name === 'SyntaxError') {
      throw new _kuery_syntax_error.KQLSyntaxError(error, expression);
    } else {
      throw error;
    }
  }
};

exports.fromKueryExpression = fromKueryExpression;

const doesKueryExpressionHaveLuceneSyntaxError = expression => {
  try {
    fromExpression(expression, {
      errorOnLuceneSyntax: true
    }, _kuery.parse);
    return false;
  } catch (e) {
    return e.message.startsWith('Lucene');
  }
};
/**
 * @params {String} indexPattern
 * @params {Object} config - contains the dateFormatTZ
 *
 * IndexPattern isn't required, but if you pass one in, we can be more intelligent
 * about how we craft the queries (e.g. scripted fields)
 */


exports.doesKueryExpressionHaveLuceneSyntaxError = doesKueryExpressionHaveLuceneSyntaxError;

const toElasticsearchQuery = (node, indexPattern, config, context) => {
  if (!node || !node.type || !_index.nodeTypes[node.type]) {
    return toElasticsearchQuery(_index.nodeTypes.function.buildNode('and', []), indexPattern);
  }

  const nodeType = _index.nodeTypes[node.type];
  return nodeType.toElasticsearchQuery(node, indexPattern, config, context);
};

exports.toElasticsearchQuery = toElasticsearchQuery;
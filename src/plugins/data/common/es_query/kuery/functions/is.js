"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildNodeParams = buildNodeParams;
exports.toElasticsearchQuery = toElasticsearchQuery;

var _lodash = require("lodash");

var _filters = require("../../filters");

var _get_fields = require("./utils/get_fields");

var _utils = require("../../utils");

var _get_full_field_name_node = require("./utils/get_full_field_name_node");

var ast = _interopRequireWildcard(require("../ast"));

var literal = _interopRequireWildcard(require("../node_types/literal"));

var wildcard = _interopRequireWildcard(require("../node_types/wildcard"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function buildNodeParams(fieldName, value, isPhrase = false) {
  if ((0, _lodash.isUndefined)(fieldName)) {
    throw new Error('fieldName is a required argument');
  }

  if ((0, _lodash.isUndefined)(value)) {
    throw new Error('value is a required argument');
  }

  const fieldNode = typeof fieldName === 'string' ? ast.fromLiteralExpression(fieldName) : literal.buildNode(fieldName);
  const valueNode = typeof value === 'string' ? ast.fromLiteralExpression(value) : literal.buildNode(value);
  const isPhraseNode = literal.buildNode(isPhrase);
  return {
    arguments: [fieldNode, valueNode, isPhraseNode]
  };
}

function toElasticsearchQuery(node, indexPattern, config = {}, context = {}) {
  const {
    arguments: [fieldNameArg, valueArg, isPhraseArg]
  } = node;
  const fullFieldNameArg = (0, _get_full_field_name_node.getFullFieldNameNode)(fieldNameArg, indexPattern, context !== null && context !== void 0 && context.nested ? context.nested.path : undefined);
  const fieldName = ast.toElasticsearchQuery(fullFieldNameArg);
  const value = !(0, _lodash.isUndefined)(valueArg) ? ast.toElasticsearchQuery(valueArg) : valueArg;
  const type = isPhraseArg.value ? 'phrase' : 'best_fields';

  if (fullFieldNameArg.value === null) {
    if (valueArg.type === 'wildcard') {
      return {
        query_string: {
          query: wildcard.toQueryStringQuery(valueArg)
        }
      };
    }

    return {
      multi_match: {
        type,
        query: value,
        lenient: true
      }
    };
  }

  const fields = indexPattern ? (0, _get_fields.getFields)(fullFieldNameArg, indexPattern) : []; // If no fields are found in the index pattern we send through the given field name as-is. We do this to preserve
  // the behaviour of lucene on dashboards where there are panels based on different index patterns that have different
  // fields. If a user queries on a field that exists in one pattern but not the other, the index pattern without the
  // field should return no results. It's debatable whether this is desirable, but it's been that way forever, so we'll
  // keep things familiar for now.

  if (fields && fields.length === 0) {
    fields.push({
      name: ast.toElasticsearchQuery(fullFieldNameArg),
      scripted: false,
      type: ''
    });
  }

  const isExistsQuery = valueArg.type === 'wildcard' && value === '*';
  const isAllFieldsQuery = fullFieldNameArg.type === 'wildcard' && fieldName === '*' || fields && indexPattern && fields.length === indexPattern.fields.length;
  const isMatchAllQuery = isExistsQuery && isAllFieldsQuery;

  if (isMatchAllQuery) {
    return {
      match_all: {}
    };
  }

  const queries = fields.reduce((accumulator, field) => {
    const wrapWithNestedQuery = query => {
      // Wildcards can easily include nested and non-nested fields. There isn't a good way to let
      // users handle this themselves so we automatically add nested queries in this scenario.
      if (!(fullFieldNameArg.type === 'wildcard') || !(0, _lodash.get)(field, 'subType.nested') || context !== null && context !== void 0 && context.nested) {
        return query;
      } else {
        return {
          nested: {
            path: field.subType.nested.path,
            query,
            score_mode: 'none'
          }
        };
      }
    };

    if (field.scripted) {
      // Exists queries don't make sense for scripted fields
      if (!isExistsQuery) {
        return [...accumulator, {
          script: { ...(0, _filters.getPhraseScript)(field, value)
          }
        }];
      }
    } else if (isExistsQuery) {
      return [...accumulator, wrapWithNestedQuery({
        exists: {
          field: field.name
        }
      })];
    } else if (valueArg.type === 'wildcard') {
      return [...accumulator, wrapWithNestedQuery({
        query_string: {
          fields: [field.name],
          query: wildcard.toQueryStringQuery(valueArg)
        }
      })];
    } else if (field.type === 'date') {
      /*
      If we detect that it's a date field and the user wants an exact date, we need to convert the query to both >= and <= the value provided to force a range query. This is because match and match_phrase queries do not accept a timezone parameter.
      dateFormatTZ can have the value of 'Browser', in which case we guess the timezone using moment.tz.guess.
      */
      const timeZoneParam = config.dateFormatTZ ? {
        time_zone: (0, _utils.getTimeZoneFromSettings)(config.dateFormatTZ)
      } : {};
      return [...accumulator, wrapWithNestedQuery({
        range: {
          [field.name]: {
            gte: value,
            lte: value,
            ...timeZoneParam
          }
        }
      })];
    } else {
      const queryType = type === 'phrase' ? 'match_phrase' : 'match';
      return [...accumulator, wrapWithNestedQuery({
        [queryType]: {
          [field.name]: value
        }
      })];
    }
  }, []);
  return {
    bool: {
      should: queries || [],
      minimum_should_match: 1
    }
  };
}
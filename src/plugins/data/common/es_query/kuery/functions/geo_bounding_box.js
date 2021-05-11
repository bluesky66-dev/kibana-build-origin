"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildNodeParams = buildNodeParams;
exports.toElasticsearchQuery = toElasticsearchQuery;

var _lodash = _interopRequireDefault(require("lodash"));

var _node_types = require("../node_types");

var ast = _interopRequireWildcard(require("../ast"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function buildNodeParams(fieldName, params) {
  params = _lodash.default.pick(params, 'topLeft', 'bottomRight');

  const fieldNameArg = _node_types.nodeTypes.literal.buildNode(fieldName);

  const args = _lodash.default.map(params, (value, key) => {
    const latLon = `${value.lat}, ${value.lon}`;
    return _node_types.nodeTypes.namedArg.buildNode(key, latLon);
  });

  return {
    arguments: [fieldNameArg, ...args]
  };
}

function toElasticsearchQuery(node, indexPattern, config = {}, context = {}) {
  var _indexPattern$fields;

  const [fieldNameArg, ...args] = node.arguments;
  const fullFieldNameArg = { ...fieldNameArg,
    value: context !== null && context !== void 0 && context.nested ? `${context.nested.path}.${fieldNameArg.value}` : fieldNameArg.value
  };

  const fieldName = _node_types.nodeTypes.literal.toElasticsearchQuery(fullFieldNameArg);

  const fieldList = (_indexPattern$fields = indexPattern === null || indexPattern === void 0 ? void 0 : indexPattern.fields) !== null && _indexPattern$fields !== void 0 ? _indexPattern$fields : [];
  const field = fieldList.find(fld => fld.name === fieldName);
  const queryParams = args.reduce((acc, arg) => {
    const snakeArgName = _lodash.default.snakeCase(arg.name);

    return { ...acc,
      [snakeArgName]: ast.toElasticsearchQuery(arg)
    };
  }, {});

  if (field !== null && field !== void 0 && field.scripted) {
    throw new Error(`Geo bounding box query does not support scripted fields`);
  }

  return {
    geo_bounding_box: {
      [fieldName]: queryParams,
      ignore_unmapped: true
    }
  };
}
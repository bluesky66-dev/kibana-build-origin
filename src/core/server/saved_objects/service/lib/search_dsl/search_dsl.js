"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSearchDsl = getSearchDsl;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _query_params = require("./query_params");

var _pit_params = require("./pit_params");

var _sorting_params = require("./sorting_params");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getSearchDsl(mappings, registry, options) {
  const {
    type,
    search,
    defaultSearchOperator,
    searchFields,
    rootSearchFields,
    searchAfter,
    sortField,
    sortOrder,
    namespaces,
    pit,
    typeToNamespacesMap,
    hasReference,
    hasReferenceOperator,
    kueryNode
  } = options;

  if (!type) {
    throw _boom.default.notAcceptable('type must be specified');
  }

  if (sortOrder && !sortField) {
    throw _boom.default.notAcceptable('sortOrder requires a sortField');
  }

  return { ...(0, _query_params.getQueryParams)({
      registry,
      namespaces,
      type,
      typeToNamespacesMap,
      search,
      searchFields,
      rootSearchFields,
      defaultSearchOperator,
      hasReference,
      hasReferenceOperator,
      kueryNode
    }),
    ...(0, _sorting_params.getSortingParams)(mappings, type, sortField, sortOrder),
    ...(pit ? (0, _pit_params.getPitParams)(pit) : {}),
    ...(searchAfter ? {
      search_after: searchAfter
    } : {})
  };
}
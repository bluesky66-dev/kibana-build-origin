"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildQueryFromKuery = buildQueryFromKuery;

var _kuery = require("../kuery");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function buildQueryFromKuery(indexPattern, queries = [], allowLeadingWildcards = false, dateFormatTZ) {
  const queryASTs = queries.map(query => {
    return (0, _kuery.fromKueryExpression)(query.query, {
      allowLeadingWildcards
    });
  });
  return buildQuery(indexPattern, queryASTs, {
    dateFormatTZ
  });
}

function buildQuery(indexPattern, queryASTs, config = {}) {
  const compoundQueryAST = _kuery.nodeTypes.function.buildNode('and', queryASTs);

  const kueryQuery = (0, _kuery.toElasticsearchQuery)(compoundQueryAST, indexPattern, config);
  return Object.assign({
    must: [],
    filter: [],
    should: [],
    must_not: []
  }, kueryQuery.bool);
}
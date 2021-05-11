"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateLegacyQuery = migrateLegacyQuery;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Creates a standardized query object from old queries that were either strings or pure ES query DSL
 *
 * @param query - a legacy query, what used to be stored in SearchSource's query property
 * @return Object
 */
function migrateLegacyQuery(query) {
  // Lucene was the only option before, so language-less queries are all lucene
  if (!(0, _lodash.has)(query, 'language')) {
    return {
      query,
      language: 'lucene'
    };
  }

  return query;
}
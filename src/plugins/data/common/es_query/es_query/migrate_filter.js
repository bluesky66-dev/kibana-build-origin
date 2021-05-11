"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateFilter = migrateFilter;

var _lodash = require("lodash");

var _filters = require("../filters");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function isDeprecatedMatchPhraseFilter(filter) {
  const fieldName = filter.query && filter.query.match && Object.keys(filter.query.match)[0];
  return Boolean(fieldName && (0, _lodash.get)(filter, ['query', 'match', fieldName, 'type']) === 'phrase');
}

function migrateFilter(filter, indexPattern) {
  if (isDeprecatedMatchPhraseFilter(filter)) {
    const fieldName = Object.keys(filter.query.match)[0];
    const params = (0, _lodash.get)(filter, ['query', 'match', fieldName]);
    let query = params.query;

    if (indexPattern) {
      const field = indexPattern.fields.find(f => f.name === fieldName);

      if (field) {
        query = (0, _filters.getConvertedValueForField)(field, params.query);
      }
    }

    return { ...filter,
      query: {
        match_phrase: {
          [fieldName]: (0, _lodash.omit)({ ...params,
            query
          }, 'type')
        }
      }
    };
  }

  return filter;
}
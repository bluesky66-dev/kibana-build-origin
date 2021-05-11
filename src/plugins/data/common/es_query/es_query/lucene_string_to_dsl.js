"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.luceneStringToDsl = luceneStringToDsl;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function luceneStringToDsl(query) {
  if ((0, _lodash.isString)(query)) {
    if (query.trim() === '') {
      return {
        match_all: {}
      };
    }

    return {
      query_string: {
        query
      }
    };
  }

  return query;
}
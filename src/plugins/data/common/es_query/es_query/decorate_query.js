"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decorateQuery = decorateQuery;

var _lodash = require("lodash");

var _utils = require("../utils");

var _es_query_dsl = require("./es_query_dsl");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Decorate queries with default parameters
 * @param query object
 * @param queryStringOptions query:queryString:options from UI settings
 * @param dateFormatTZ dateFormat:tz from UI settings
 * @returns {object}
 */
function decorateQuery(query, queryStringOptions, dateFormatTZ) {
  if ((0, _es_query_dsl.isEsQueryString)(query)) {
    // NOTE queryStringOptions comes from UI Settings and, in server context, is a serialized string
    // https://github.com/elastic/kibana/issues/89902
    if (typeof queryStringOptions === 'string') {
      queryStringOptions = JSON.parse(queryStringOptions);
    }

    (0, _lodash.extend)(query.query_string, queryStringOptions);

    if (dateFormatTZ) {
      (0, _lodash.defaults)(query.query_string, {
        time_zone: (0, _utils.getTimeZoneFromSettings)(dateFormatTZ)
      });
    }
  }

  return query;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "tabifyAggResponse", {
  enumerable: true,
  get: function () {
    return _tabify.tabifyAggResponse;
  }
});
Object.defineProperty(exports, "tabifyDocs", {
  enumerable: true,
  get: function () {
    return _tabify_docs.tabifyDocs;
  }
});
Object.defineProperty(exports, "tabifyGetColumns", {
  enumerable: true,
  get: function () {
    return _get_columns.tabifyGetColumns;
  }
});
exports.tabify = void 0;

var _tabify = require("./tabify");

var _tabify_docs = require("./tabify_docs");

var _get_columns = require("./get_columns");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const tabify = (searchSource, esResponse, opts) => {
  return !esResponse.aggregations ? (0, _tabify_docs.tabifyDocs)(esResponse, searchSource.getField('index'), opts) : (0, _tabify.tabifyAggResponse)(searchSource.getField('aggs'), esResponse, opts);
};

exports.tabify = tabify;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitByFilter = splitByFilter;

var _helpers = require("../../helpers");

var _server = require("../../../../../../data/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function splitByFilter(req, panel, series, esQueryConfig, indexPattern) {
  return next => doc => {
    if (series.split_mode !== 'filter') {
      return next(doc);
    }

    (0, _helpers.overwrite)(doc, `aggs.${series.id}.filter`, _server.esQuery.buildEsQuery(indexPattern, [series.filter], [], esQueryConfig));
    return next(doc);
  };
}
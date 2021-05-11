"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitByEverything = splitByEverything;

var _helpers = require("../../helpers");

var _server = require("../../../../../../data/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function splitByEverything(req, panel, esQueryConfig, indexPattern) {
  return next => doc => {
    panel.series.filter(c => !(c.aggregate_by && c.aggregate_function)).forEach(column => {
      if (column.filter) {
        (0, _helpers.overwrite)(doc, `aggs.pivot.aggs.${column.id}.filter`, _server.esQuery.buildEsQuery(indexPattern, [column.filter], [], esQueryConfig));
      } else {
        (0, _helpers.overwrite)(doc, `aggs.pivot.aggs.${column.id}.filter.match_all`, {});
      }
    });
    return next(doc);
  };
}
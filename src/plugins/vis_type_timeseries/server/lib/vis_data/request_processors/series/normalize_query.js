"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeQuery = normalizeQuery;

var _helpers = require("../../helpers");

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isEmptyFilter = (filter = {}) => Boolean(filter.match_all) && _lodash.default.isEmpty(filter.match_all);

const hasSiblingPipelineAggregation = (aggs = {}) => Object.keys(aggs).length > 1;
/* For grouping by the 'Everything', the splitByEverything request processor
 * creates fake .filter.match_all filter (see split_by_everything.js) to simplify the request processors code.
 * But “filters” are not supported by all of available search strategies (e.g. Rollup search).
 * This method removes that aggregation.
 *
 * Important: for Sibling Pipeline aggregation we cannot apply this logic
 *
 */


function removeEmptyTopLevelAggregation(doc, series) {
  const filter = _lodash.default.get(doc, `aggs.${series.id}.filter`);

  if (isEmptyFilter(filter) && !hasSiblingPipelineAggregation(doc.aggs[series.id].aggs)) {
    const meta = _lodash.default.get(doc, `aggs.${series.id}.meta`);

    (0, _helpers.overwrite)(doc, `aggs`, doc.aggs[series.id].aggs);
    (0, _helpers.overwrite)(doc, `aggs.timeseries.meta`, meta);
  }

  return doc;
}
/* Last query handler in the chain. You can use this handler
 * as the last place where you can modify the "doc" (request body) object before sending it to ES.
 */


function normalizeQuery(req, panel, series) {
  return next => doc => {
    return next(removeEmptyTopLevelAggregation(doc, series));
  };
}
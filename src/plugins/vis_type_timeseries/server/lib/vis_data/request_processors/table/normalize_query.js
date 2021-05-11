"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeQuery = normalizeQuery;

var _lodash = _interopRequireDefault(require("lodash"));

var _helpers = require("../../helpers");

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
/* Last query handler in the chain. You can use this handler
 * as the last place where you can modify the "doc" (request body) object before sending it to ES.

 * Important: for Sibling Pipeline aggregation we cannot apply this logic
 *
 */


function normalizeQuery() {
  return () => doc => {
    const series = _lodash.default.get(doc, 'aggs.pivot.aggs');

    const normalizedSeries = {};

    _lodash.default.forEach(series, (value, seriesId) => {
      const filter = _lodash.default.get(value, `filter`);

      if (isEmptyFilter(filter) && !hasSiblingPipelineAggregation(value.aggs)) {
        const agg = _lodash.default.get(value, 'aggs.timeseries');

        const meta = { ..._lodash.default.get(value, 'meta'),
          seriesId
        };
        (0, _helpers.overwrite)(normalizedSeries, `${seriesId}`, agg);
        (0, _helpers.overwrite)(normalizedSeries, `${seriesId}.meta`, meta);
      } else {
        (0, _helpers.overwrite)(normalizedSeries, `${seriesId}`, value);
      }
    });

    (0, _helpers.overwrite)(doc, 'aggs.pivot.aggs', normalizedSeries);
    return doc;
  };
}
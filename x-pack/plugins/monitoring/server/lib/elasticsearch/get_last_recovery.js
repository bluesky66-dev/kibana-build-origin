"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterOldShardActivity = filterOldShardActivity;
exports.handleLastRecoveries = handleLastRecoveries;
exports.getLastRecovery = getLastRecovery;

var _moment = _interopRequireDefault(require("moment"));

var _lodash = _interopRequireDefault(require("lodash"));

var _error_missing_required = require("../error_missing_required");

var _create_query = require("../create_query");

var _metrics = require("../metrics");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore
// @ts-ignore

/**
 * Filter out shard activity that we do not care about.
 *
 * The shard activity gets returned as a big document with a lot of shard activity reported that is out of date with respect
 * to the date range of the polling window. We only care about any shard activity that isn't finished yet, or that ended
 * after the polling window (it's implied that the activity is relevant for the _end_ time because the document wouldn't
 * have been returned otherwise).
 *
 * @param {Number} startMs Start time in milliseconds of the polling window
 * @returns {boolean} true to keep
 */


function filterOldShardActivity(startMs) {
  return activity => {
    // either it's still going and there is no stop time, or the stop time happened after we started looking for one
    return !_lodash.default.isNumber(activity.stop_time_in_millis) || activity.stop_time_in_millis >= startMs;
  };
}
/**
 * The response handler for {@link getLastRecovery}.
 *
 * This is exposed for testing.
 * @param {Object} resp The response returned from the search request
 * @param {Date} start The start time from the request payload (expected to be of type {@code Date})
 * @returns {Object[]} An array of shards representing active shard activity from {@code _source.index_recovery.shards}.
 */


function handleLastRecoveries(resp, start) {
  var _resp$hits;

  if (((_resp$hits = resp.hits) === null || _resp$hits === void 0 ? void 0 : _resp$hits.hits.length) === 1) {
    var _resp$hits$hits$0$_so, _resp$hits2, _resp$hits2$hits$, _resp$hits2$hits$$_so;

    const data = ((_resp$hits$hits$0$_so = (_resp$hits2 = resp.hits) === null || _resp$hits2 === void 0 ? void 0 : (_resp$hits2$hits$ = _resp$hits2.hits[0]) === null || _resp$hits2$hits$ === void 0 ? void 0 : (_resp$hits2$hits$$_so = _resp$hits2$hits$._source.index_recovery) === null || _resp$hits2$hits$$_so === void 0 ? void 0 : _resp$hits2$hits$$_so.shards) !== null && _resp$hits$hits$0$_so !== void 0 ? _resp$hits$hits$0$_so : []).filter(filterOldShardActivity(_moment.default.utc(start).valueOf()));
    data.sort((a, b) => b.start_time_in_millis - a.start_time_in_millis);
    return data;
  }

  return [];
}

function getLastRecovery(req, esIndexPattern) {
  (0, _error_missing_required.checkParam)(esIndexPattern, 'esIndexPattern in elasticsearch/getLastRecovery');
  const start = req.payload.timeRange.min;
  const end = req.payload.timeRange.max;
  const clusterUuid = req.params.clusterUuid;

  const metric = _metrics.ElasticsearchMetric.getMetricFields();

  const params = {
    index: esIndexPattern,
    size: 1,
    ignoreUnavailable: true,
    body: {
      _source: ['index_recovery.shards'],
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: (0, _create_query.createQuery)({
        type: 'index_recovery',
        start,
        end,
        clusterUuid,
        metric
      })
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(resp => {
    return handleLastRecoveries(resp, start);
  });
}
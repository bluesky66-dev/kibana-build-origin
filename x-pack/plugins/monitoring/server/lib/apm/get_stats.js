"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.getStats = getStats;

var _moment = _interopRequireDefault(require("moment"));

var _error_missing_required = require("../error_missing_required");

var _create_apm_query = require("./create_apm_query");

var _apm_stats = require("./_apm_stats");

var _get_time_of_last_event = require("./_get_time_of_last_event");

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


function handleResponse(...args) {
  const {
    apmTotal,
    totalEvents,
    bytesSent
  } = (0, _apm_stats.apmAggResponseHandler)(...args);
  return {
    bytesSent,
    totalEvents,
    apms: {
      total: apmTotal
    }
  };
}

async function getStats(req, apmIndexPattern, clusterUuid) {
  (0, _error_missing_required.checkParam)(apmIndexPattern, 'apmIndexPattern in getBeats');
  const config = req.server.config();

  const start = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const end = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const maxBucketSize = config.get('monitoring.ui.max_bucket_size');
  const params = {
    index: apmIndexPattern,
    filterPath: _apm_stats.apmAggFilterPath,
    size: 0,
    ignoreUnavailable: true,
    body: {
      query: (0, _create_apm_query.createApmQuery)({
        start,
        end,
        clusterUuid
      }),
      aggs: (0, _apm_stats.apmUuidsAgg)(maxBucketSize)
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const [response, timeOfLastEvent] = await Promise.all([callWithRequest(req, 'search', params), (0, _get_time_of_last_event.getTimeOfLastEvent)({
    req,
    callWithRequest,
    apmIndexPattern,
    start,
    end,
    clusterUuid
  })]);
  const formattedResponse = handleResponse(response, start, end);
  return { ...formattedResponse,
    timeOfLastEvent
  };
}
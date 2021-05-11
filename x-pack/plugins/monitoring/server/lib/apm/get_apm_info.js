"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.getApmInfo = getApmInfo;

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _create_query = require("../create_query");

var _beats_stats = require("../beats/_beats_stats");

var _metrics = require("../metrics");

var _get_time_of_last_event = require("./_get_time_of_last_event");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore


function handleResponse(response, apmUuid) {
  var _firstHit$_source$bea, _firstHit$inner_hits, _firstHit$inner_hits$, _firstHit$inner_hits$2, _firstHit$inner_hits2, _firstHit$inner_hits3, _firstHit$inner_hits4, _firstStats, _firstStats$metrics, _firstStats$metrics$l, _firstStats$metrics$l2, _firstStats$metrics$l3, _firstStats2, _firstStats2$metrics, _firstStats2$metrics$, _firstStats2$metrics$2, _firstStats2$metrics$3, _firstStats3, _firstStats3$metrics, _firstStats3$metrics$, _firstStats3$metrics$2, _firstStats3$metrics$3, _firstStats4, _firstStats4$metrics, _firstStats4$metrics$, _firstStats4$metrics$2, _firstStats4$metrics$3, _stats$metrics, _stats$metrics$libbea, _stats$metrics$libbea2, _stats$metrics$libbea3, _stats$metrics2, _stats$metrics2$libbe, _stats$metrics2$libbe2, _stats$metrics2$libbe3, _stats$metrics3, _stats$metrics3$libbe, _stats$metrics3$libbe2, _stats$metrics3$libbe3, _stats$metrics4, _stats$metrics4$libbe, _stats$metrics4$libbe2, _stats$metrics4$libbe3, _stats$beat, _stats$beat2, _stats$beat3, _stats$beat4, _stats$metrics5, _stats$metrics5$libbe, _stats$metrics5$libbe2, _stats$metrics6, _stats$metrics6$libbe, _stats$metrics6$libbe2, _stats$metrics7, _stats$metrics7$beat, _stats$metrics7$beat$, _stats$metrics7$beat$2;

  if (!response.hits || response.hits.hits.length === 0) {
    return {};
  }

  const firstHit = response.hits.hits[0];
  let firstStats = null;
  const stats = (_firstHit$_source$bea = firstHit._source.beats_stats) !== null && _firstHit$_source$bea !== void 0 ? _firstHit$_source$bea : {};

  if ((_firstHit$inner_hits = firstHit.inner_hits) !== null && _firstHit$inner_hits !== void 0 && (_firstHit$inner_hits$ = _firstHit$inner_hits.first_hit) !== null && _firstHit$inner_hits$ !== void 0 && (_firstHit$inner_hits$2 = _firstHit$inner_hits$.hits) !== null && _firstHit$inner_hits$2 !== void 0 && _firstHit$inner_hits$2.hits && ((_firstHit$inner_hits2 = firstHit.inner_hits) === null || _firstHit$inner_hits2 === void 0 ? void 0 : (_firstHit$inner_hits3 = _firstHit$inner_hits2.first_hit) === null || _firstHit$inner_hits3 === void 0 ? void 0 : (_firstHit$inner_hits4 = _firstHit$inner_hits3.hits) === null || _firstHit$inner_hits4 === void 0 ? void 0 : _firstHit$inner_hits4.hits.length) > 0 && firstHit.inner_hits.first_hit.hits.hits[0]._source.beats_stats) {
    firstStats = firstHit.inner_hits.first_hit.hits.hits[0]._source.beats_stats;
  }

  const eventsTotalFirst = (_firstStats = firstStats) === null || _firstStats === void 0 ? void 0 : (_firstStats$metrics = _firstStats.metrics) === null || _firstStats$metrics === void 0 ? void 0 : (_firstStats$metrics$l = _firstStats$metrics.libbeat) === null || _firstStats$metrics$l === void 0 ? void 0 : (_firstStats$metrics$l2 = _firstStats$metrics$l.pipeline) === null || _firstStats$metrics$l2 === void 0 ? void 0 : (_firstStats$metrics$l3 = _firstStats$metrics$l2.events) === null || _firstStats$metrics$l3 === void 0 ? void 0 : _firstStats$metrics$l3.total;
  const eventsEmittedFirst = (_firstStats2 = firstStats) === null || _firstStats2 === void 0 ? void 0 : (_firstStats2$metrics = _firstStats2.metrics) === null || _firstStats2$metrics === void 0 ? void 0 : (_firstStats2$metrics$ = _firstStats2$metrics.libbeat) === null || _firstStats2$metrics$ === void 0 ? void 0 : (_firstStats2$metrics$2 = _firstStats2$metrics$.pipeline) === null || _firstStats2$metrics$2 === void 0 ? void 0 : (_firstStats2$metrics$3 = _firstStats2$metrics$2.events) === null || _firstStats2$metrics$3 === void 0 ? void 0 : _firstStats2$metrics$3.published;
  const eventsDroppedFirst = (_firstStats3 = firstStats) === null || _firstStats3 === void 0 ? void 0 : (_firstStats3$metrics = _firstStats3.metrics) === null || _firstStats3$metrics === void 0 ? void 0 : (_firstStats3$metrics$ = _firstStats3$metrics.libbeat) === null || _firstStats3$metrics$ === void 0 ? void 0 : (_firstStats3$metrics$2 = _firstStats3$metrics$.pipeline) === null || _firstStats3$metrics$2 === void 0 ? void 0 : (_firstStats3$metrics$3 = _firstStats3$metrics$2.events) === null || _firstStats3$metrics$3 === void 0 ? void 0 : _firstStats3$metrics$3.dropped;
  const bytesWrittenFirst = (_firstStats4 = firstStats) === null || _firstStats4 === void 0 ? void 0 : (_firstStats4$metrics = _firstStats4.metrics) === null || _firstStats4$metrics === void 0 ? void 0 : (_firstStats4$metrics$ = _firstStats4$metrics.libbeat) === null || _firstStats4$metrics$ === void 0 ? void 0 : (_firstStats4$metrics$2 = _firstStats4$metrics$.output) === null || _firstStats4$metrics$2 === void 0 ? void 0 : (_firstStats4$metrics$3 = _firstStats4$metrics$2.write) === null || _firstStats4$metrics$3 === void 0 ? void 0 : _firstStats4$metrics$3.bytes;
  const eventsTotalLast = (_stats$metrics = stats.metrics) === null || _stats$metrics === void 0 ? void 0 : (_stats$metrics$libbea = _stats$metrics.libbeat) === null || _stats$metrics$libbea === void 0 ? void 0 : (_stats$metrics$libbea2 = _stats$metrics$libbea.pipeline) === null || _stats$metrics$libbea2 === void 0 ? void 0 : (_stats$metrics$libbea3 = _stats$metrics$libbea2.events) === null || _stats$metrics$libbea3 === void 0 ? void 0 : _stats$metrics$libbea3.total;
  const eventsEmittedLast = (_stats$metrics2 = stats.metrics) === null || _stats$metrics2 === void 0 ? void 0 : (_stats$metrics2$libbe = _stats$metrics2.libbeat) === null || _stats$metrics2$libbe === void 0 ? void 0 : (_stats$metrics2$libbe2 = _stats$metrics2$libbe.pipeline) === null || _stats$metrics2$libbe2 === void 0 ? void 0 : (_stats$metrics2$libbe3 = _stats$metrics2$libbe2.events) === null || _stats$metrics2$libbe3 === void 0 ? void 0 : _stats$metrics2$libbe3.published;
  const eventsDroppedLast = (_stats$metrics3 = stats.metrics) === null || _stats$metrics3 === void 0 ? void 0 : (_stats$metrics3$libbe = _stats$metrics3.libbeat) === null || _stats$metrics3$libbe === void 0 ? void 0 : (_stats$metrics3$libbe2 = _stats$metrics3$libbe.pipeline) === null || _stats$metrics3$libbe2 === void 0 ? void 0 : (_stats$metrics3$libbe3 = _stats$metrics3$libbe2.events) === null || _stats$metrics3$libbe3 === void 0 ? void 0 : _stats$metrics3$libbe3.dropped;
  const bytesWrittenLast = (_stats$metrics4 = stats.metrics) === null || _stats$metrics4 === void 0 ? void 0 : (_stats$metrics4$libbe = _stats$metrics4.libbeat) === null || _stats$metrics4$libbe === void 0 ? void 0 : (_stats$metrics4$libbe2 = _stats$metrics4$libbe.output) === null || _stats$metrics4$libbe2 === void 0 ? void 0 : (_stats$metrics4$libbe3 = _stats$metrics4$libbe2.write) === null || _stats$metrics4$libbe3 === void 0 ? void 0 : _stats$metrics4$libbe3.bytes;
  return {
    uuid: apmUuid,
    transportAddress: (_stats$beat = stats.beat) === null || _stats$beat === void 0 ? void 0 : _stats$beat.host,
    version: (_stats$beat2 = stats.beat) === null || _stats$beat2 === void 0 ? void 0 : _stats$beat2.version,
    name: (_stats$beat3 = stats.beat) === null || _stats$beat3 === void 0 ? void 0 : _stats$beat3.name,
    type: (0, _lodash.upperFirst)((_stats$beat4 = stats.beat) === null || _stats$beat4 === void 0 ? void 0 : _stats$beat4.type) || null,
    output: (0, _lodash.upperFirst)((_stats$metrics5 = stats.metrics) === null || _stats$metrics5 === void 0 ? void 0 : (_stats$metrics5$libbe = _stats$metrics5.libbeat) === null || _stats$metrics5$libbe === void 0 ? void 0 : (_stats$metrics5$libbe2 = _stats$metrics5$libbe.output) === null || _stats$metrics5$libbe2 === void 0 ? void 0 : _stats$metrics5$libbe2.type) || null,
    configReloads: (_stats$metrics6 = stats.metrics) === null || _stats$metrics6 === void 0 ? void 0 : (_stats$metrics6$libbe = _stats$metrics6.libbeat) === null || _stats$metrics6$libbe === void 0 ? void 0 : (_stats$metrics6$libbe2 = _stats$metrics6$libbe.config) === null || _stats$metrics6$libbe2 === void 0 ? void 0 : _stats$metrics6$libbe2.reloads,
    uptime: (_stats$metrics7 = stats.metrics) === null || _stats$metrics7 === void 0 ? void 0 : (_stats$metrics7$beat = _stats$metrics7.beat) === null || _stats$metrics7$beat === void 0 ? void 0 : (_stats$metrics7$beat$ = _stats$metrics7$beat.info) === null || _stats$metrics7$beat$ === void 0 ? void 0 : (_stats$metrics7$beat$2 = _stats$metrics7$beat$.uptime) === null || _stats$metrics7$beat$2 === void 0 ? void 0 : _stats$metrics7$beat$2.ms,
    eventsTotal: (0, _beats_stats.getDiffCalculation)(eventsTotalLast, eventsTotalFirst),
    eventsEmitted: (0, _beats_stats.getDiffCalculation)(eventsEmittedLast, eventsEmittedFirst),
    eventsDropped: (0, _beats_stats.getDiffCalculation)(eventsDroppedLast, eventsDroppedFirst),
    bytesWritten: (0, _beats_stats.getDiffCalculation)(bytesWrittenLast, bytesWrittenFirst)
  };
}

async function getApmInfo(req, apmIndexPattern, {
  clusterUuid,
  apmUuid,
  start,
  end
}) {
  (0, _error_missing_required.checkParam)(apmIndexPattern, 'apmIndexPattern in beats/getBeatSummary');
  const filters = [{
    term: {
      'beats_stats.beat.uuid': apmUuid
    }
  }, {
    term: {
      'beats_stats.beat.type': 'apm-server'
    }
  }];
  const params = {
    index: apmIndexPattern,
    size: 1,
    ignoreUnavailable: true,
    filterPath: ['hits.hits._source.beats_stats.beat.host', 'hits.hits._source.beats_stats.beat.version', 'hits.hits._source.beats_stats.beat.name', 'hits.hits._source.beats_stats.beat.type', 'hits.hits._source.beats_stats.metrics.libbeat.output.type', 'hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.published', 'hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.total', 'hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.dropped', 'hits.hits._source.beats_stats.metrics.libbeat.output.write.bytes', 'hits.hits._source.beats_stats.metrics.libbeat.config.reloads', 'hits.hits._source.beats_stats.metrics.beat.info.uptime.ms', 'hits.hits.inner_hits.first_hit.hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.published', 'hits.hits.inner_hits.first_hit.hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.total', 'hits.hits.inner_hits.first_hit.hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.dropped', 'hits.hits.inner_hits.first_hit.hits.hits._source.beats_stats.metrics.libbeat.output.write.bytes'],
    body: {
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: (0, _create_query.createQuery)({
        start,
        end,
        clusterUuid,
        metric: _metrics.ApmMetric.getMetricFields(),
        filters
      }),
      collapse: {
        field: 'beats_stats.metrics.beat.info.ephemeral_id',
        // collapse on ephemeral_id to handle restart
        inner_hits: {
          name: 'first_hit',
          size: 1,
          sort: {
            'beats_stats.timestamp': {
              order: 'asc',
              unmapped_type: 'long'
            }
          }
        }
      }
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
  const formattedResponse = handleResponse(response, apmUuid);
  return { ...formattedResponse,
    timeOfLastEvent
  };
}
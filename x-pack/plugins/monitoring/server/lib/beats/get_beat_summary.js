"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.getBeatSummary = getBeatSummary;

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _create_beats_query = require("./create_beats_query.js");

var _beats_stats = require("./_beats_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore
// @ts-ignore


function handleResponse(response, beatUuid) {
  var _firstHit$inner_hits, _firstHit$inner_hits$, _firstHit$inner_hits$2, _firstHit$inner_hits2, _firstHit$inner_hits3, _firstHit$inner_hits4, _firstHit$_source$bea, _firstStats$metrics$l, _firstStats, _firstStats$metrics, _firstStats$metrics$l2, _firstStats$metrics$l3, _firstStats$metrics$l4, _firstStats$metrics$l5, _firstStats2, _firstStats2$metrics, _firstStats2$metrics$, _firstStats2$metrics$2, _firstStats2$metrics$3, _firstStats$metrics$l6, _firstStats3, _firstStats3$metrics, _firstStats3$metrics$, _firstStats3$metrics$2, _firstStats3$metrics$3, _firstStats$metrics$l7, _firstStats4, _firstStats4$metrics, _firstStats4$metrics$, _firstStats4$metrics$2, _firstStats4$metrics$3, _stats$metrics$libbea, _stats$metrics, _stats$metrics$libbea2, _stats$metrics$libbea3, _stats$metrics$libbea4, _stats$metrics$libbea5, _stats$metrics2, _stats$metrics2$libbe, _stats$metrics2$libbe2, _stats$metrics2$libbe3, _stats$metrics$libbea6, _stats$metrics3, _stats$metrics3$libbe, _stats$metrics3$libbe2, _stats$metrics3$libbe3, _stats$metrics$libbea7, _stats$metrics4, _stats$metrics4$libbe, _stats$metrics4$libbe2, _stats$metrics4$libbe3, _stats$metrics$beat$h, _stats$metrics5, _stats$metrics5$beat, _stats$metrics5$beat$, _stats$metrics5$beat$2, _stats$metrics$beat$h2, _stats$metrics6, _stats$metrics6$beat, _stats$metrics6$beat$, _stats$metrics6$beat$2, _stats$beat$host, _stats$beat, _stats$beat$version, _stats$beat2, _stats$beat$name, _stats$beat3, _upperFirst, _stats$beat4, _upperFirst2, _stats$metrics7, _stats$metrics7$libbe, _stats$metrics7$libbe2, _stats$metrics$libbea8, _stats$metrics8, _stats$metrics8$libbe, _stats$metrics8$libbe2, _stats$metrics$beat$i, _stats$metrics9, _stats$metrics9$beat, _stats$metrics9$beat$, _stats$metrics9$beat$2, _getDiffCalculation, _getDiffCalculation2, _getDiffCalculation3, _getDiffCalculation4;

  if (!response.hits || response.hits.hits.length === 0) {
    return {};
  }

  const firstHit = response.hits.hits[0];
  let firstStats = null;

  if ((_firstHit$inner_hits = firstHit.inner_hits) !== null && _firstHit$inner_hits !== void 0 && (_firstHit$inner_hits$ = _firstHit$inner_hits.first_hit) !== null && _firstHit$inner_hits$ !== void 0 && (_firstHit$inner_hits$2 = _firstHit$inner_hits$.hits) !== null && _firstHit$inner_hits$2 !== void 0 && _firstHit$inner_hits$2.hits && ((_firstHit$inner_hits2 = firstHit.inner_hits) === null || _firstHit$inner_hits2 === void 0 ? void 0 : (_firstHit$inner_hits3 = _firstHit$inner_hits2.first_hit) === null || _firstHit$inner_hits3 === void 0 ? void 0 : (_firstHit$inner_hits4 = _firstHit$inner_hits3.hits) === null || _firstHit$inner_hits4 === void 0 ? void 0 : _firstHit$inner_hits4.hits.length) > 0 && firstHit.inner_hits.first_hit.hits.hits[0]._source.beats_stats) {
    firstStats = firstHit.inner_hits.first_hit.hits.hits[0]._source.beats_stats;
  }

  const stats = (_firstHit$_source$bea = firstHit._source.beats_stats) !== null && _firstHit$_source$bea !== void 0 ? _firstHit$_source$bea : {};
  const eventsTotalFirst = (_firstStats$metrics$l = (_firstStats = firstStats) === null || _firstStats === void 0 ? void 0 : (_firstStats$metrics = _firstStats.metrics) === null || _firstStats$metrics === void 0 ? void 0 : (_firstStats$metrics$l2 = _firstStats$metrics.libbeat) === null || _firstStats$metrics$l2 === void 0 ? void 0 : (_firstStats$metrics$l3 = _firstStats$metrics$l2.pipeline) === null || _firstStats$metrics$l3 === void 0 ? void 0 : (_firstStats$metrics$l4 = _firstStats$metrics$l3.events) === null || _firstStats$metrics$l4 === void 0 ? void 0 : _firstStats$metrics$l4.total) !== null && _firstStats$metrics$l !== void 0 ? _firstStats$metrics$l : null;
  const eventsEmittedFirst = (_firstStats$metrics$l5 = (_firstStats2 = firstStats) === null || _firstStats2 === void 0 ? void 0 : (_firstStats2$metrics = _firstStats2.metrics) === null || _firstStats2$metrics === void 0 ? void 0 : (_firstStats2$metrics$ = _firstStats2$metrics.libbeat) === null || _firstStats2$metrics$ === void 0 ? void 0 : (_firstStats2$metrics$2 = _firstStats2$metrics$.pipeline) === null || _firstStats2$metrics$2 === void 0 ? void 0 : (_firstStats2$metrics$3 = _firstStats2$metrics$2.events) === null || _firstStats2$metrics$3 === void 0 ? void 0 : _firstStats2$metrics$3.published) !== null && _firstStats$metrics$l5 !== void 0 ? _firstStats$metrics$l5 : null;
  const eventsDroppedFirst = (_firstStats$metrics$l6 = (_firstStats3 = firstStats) === null || _firstStats3 === void 0 ? void 0 : (_firstStats3$metrics = _firstStats3.metrics) === null || _firstStats3$metrics === void 0 ? void 0 : (_firstStats3$metrics$ = _firstStats3$metrics.libbeat) === null || _firstStats3$metrics$ === void 0 ? void 0 : (_firstStats3$metrics$2 = _firstStats3$metrics$.pipeline) === null || _firstStats3$metrics$2 === void 0 ? void 0 : (_firstStats3$metrics$3 = _firstStats3$metrics$2.events) === null || _firstStats3$metrics$3 === void 0 ? void 0 : _firstStats3$metrics$3.dropped) !== null && _firstStats$metrics$l6 !== void 0 ? _firstStats$metrics$l6 : null;
  const bytesWrittenFirst = (_firstStats$metrics$l7 = (_firstStats4 = firstStats) === null || _firstStats4 === void 0 ? void 0 : (_firstStats4$metrics = _firstStats4.metrics) === null || _firstStats4$metrics === void 0 ? void 0 : (_firstStats4$metrics$ = _firstStats4$metrics.libbeat) === null || _firstStats4$metrics$ === void 0 ? void 0 : (_firstStats4$metrics$2 = _firstStats4$metrics$.output) === null || _firstStats4$metrics$2 === void 0 ? void 0 : (_firstStats4$metrics$3 = _firstStats4$metrics$2.write) === null || _firstStats4$metrics$3 === void 0 ? void 0 : _firstStats4$metrics$3.bytes) !== null && _firstStats$metrics$l7 !== void 0 ? _firstStats$metrics$l7 : null;
  const eventsTotalLast = (_stats$metrics$libbea = stats === null || stats === void 0 ? void 0 : (_stats$metrics = stats.metrics) === null || _stats$metrics === void 0 ? void 0 : (_stats$metrics$libbea2 = _stats$metrics.libbeat) === null || _stats$metrics$libbea2 === void 0 ? void 0 : (_stats$metrics$libbea3 = _stats$metrics$libbea2.pipeline) === null || _stats$metrics$libbea3 === void 0 ? void 0 : (_stats$metrics$libbea4 = _stats$metrics$libbea3.events) === null || _stats$metrics$libbea4 === void 0 ? void 0 : _stats$metrics$libbea4.total) !== null && _stats$metrics$libbea !== void 0 ? _stats$metrics$libbea : null;
  const eventsEmittedLast = (_stats$metrics$libbea5 = stats === null || stats === void 0 ? void 0 : (_stats$metrics2 = stats.metrics) === null || _stats$metrics2 === void 0 ? void 0 : (_stats$metrics2$libbe = _stats$metrics2.libbeat) === null || _stats$metrics2$libbe === void 0 ? void 0 : (_stats$metrics2$libbe2 = _stats$metrics2$libbe.pipeline) === null || _stats$metrics2$libbe2 === void 0 ? void 0 : (_stats$metrics2$libbe3 = _stats$metrics2$libbe2.events) === null || _stats$metrics2$libbe3 === void 0 ? void 0 : _stats$metrics2$libbe3.published) !== null && _stats$metrics$libbea5 !== void 0 ? _stats$metrics$libbea5 : null;
  const eventsDroppedLast = (_stats$metrics$libbea6 = stats === null || stats === void 0 ? void 0 : (_stats$metrics3 = stats.metrics) === null || _stats$metrics3 === void 0 ? void 0 : (_stats$metrics3$libbe = _stats$metrics3.libbeat) === null || _stats$metrics3$libbe === void 0 ? void 0 : (_stats$metrics3$libbe2 = _stats$metrics3$libbe.pipeline) === null || _stats$metrics3$libbe2 === void 0 ? void 0 : (_stats$metrics3$libbe3 = _stats$metrics3$libbe2.events) === null || _stats$metrics3$libbe3 === void 0 ? void 0 : _stats$metrics3$libbe3.dropped) !== null && _stats$metrics$libbea6 !== void 0 ? _stats$metrics$libbea6 : null;
  const bytesWrittenLast = (_stats$metrics$libbea7 = stats === null || stats === void 0 ? void 0 : (_stats$metrics4 = stats.metrics) === null || _stats$metrics4 === void 0 ? void 0 : (_stats$metrics4$libbe = _stats$metrics4.libbeat) === null || _stats$metrics4$libbe === void 0 ? void 0 : (_stats$metrics4$libbe2 = _stats$metrics4$libbe.output) === null || _stats$metrics4$libbe2 === void 0 ? void 0 : (_stats$metrics4$libbe3 = _stats$metrics4$libbe2.write) === null || _stats$metrics4$libbe3 === void 0 ? void 0 : _stats$metrics4$libbe3.bytes) !== null && _stats$metrics$libbea7 !== void 0 ? _stats$metrics$libbea7 : null;
  const handlesHardLimit = (_stats$metrics$beat$h = stats === null || stats === void 0 ? void 0 : (_stats$metrics5 = stats.metrics) === null || _stats$metrics5 === void 0 ? void 0 : (_stats$metrics5$beat = _stats$metrics5.beat) === null || _stats$metrics5$beat === void 0 ? void 0 : (_stats$metrics5$beat$ = _stats$metrics5$beat.handles) === null || _stats$metrics5$beat$ === void 0 ? void 0 : (_stats$metrics5$beat$2 = _stats$metrics5$beat$.limit) === null || _stats$metrics5$beat$2 === void 0 ? void 0 : _stats$metrics5$beat$2.hard) !== null && _stats$metrics$beat$h !== void 0 ? _stats$metrics$beat$h : null;
  const handlesSoftLimit = (_stats$metrics$beat$h2 = stats === null || stats === void 0 ? void 0 : (_stats$metrics6 = stats.metrics) === null || _stats$metrics6 === void 0 ? void 0 : (_stats$metrics6$beat = _stats$metrics6.beat) === null || _stats$metrics6$beat === void 0 ? void 0 : (_stats$metrics6$beat$ = _stats$metrics6$beat.handles) === null || _stats$metrics6$beat$ === void 0 ? void 0 : (_stats$metrics6$beat$2 = _stats$metrics6$beat$.limit) === null || _stats$metrics6$beat$2 === void 0 ? void 0 : _stats$metrics6$beat$2.soft) !== null && _stats$metrics$beat$h2 !== void 0 ? _stats$metrics$beat$h2 : null;
  return {
    uuid: beatUuid,
    transportAddress: (_stats$beat$host = stats === null || stats === void 0 ? void 0 : (_stats$beat = stats.beat) === null || _stats$beat === void 0 ? void 0 : _stats$beat.host) !== null && _stats$beat$host !== void 0 ? _stats$beat$host : null,
    version: (_stats$beat$version = stats === null || stats === void 0 ? void 0 : (_stats$beat2 = stats.beat) === null || _stats$beat2 === void 0 ? void 0 : _stats$beat2.version) !== null && _stats$beat$version !== void 0 ? _stats$beat$version : null,
    name: (_stats$beat$name = stats === null || stats === void 0 ? void 0 : (_stats$beat3 = stats.beat) === null || _stats$beat3 === void 0 ? void 0 : _stats$beat3.name) !== null && _stats$beat$name !== void 0 ? _stats$beat$name : null,
    type: (_upperFirst = (0, _lodash.upperFirst)(stats === null || stats === void 0 ? void 0 : (_stats$beat4 = stats.beat) === null || _stats$beat4 === void 0 ? void 0 : _stats$beat4.type)) !== null && _upperFirst !== void 0 ? _upperFirst : null,
    output: (_upperFirst2 = (0, _lodash.upperFirst)(stats === null || stats === void 0 ? void 0 : (_stats$metrics7 = stats.metrics) === null || _stats$metrics7 === void 0 ? void 0 : (_stats$metrics7$libbe = _stats$metrics7.libbeat) === null || _stats$metrics7$libbe === void 0 ? void 0 : (_stats$metrics7$libbe2 = _stats$metrics7$libbe.output) === null || _stats$metrics7$libbe2 === void 0 ? void 0 : _stats$metrics7$libbe2.type)) !== null && _upperFirst2 !== void 0 ? _upperFirst2 : null,
    configReloads: (_stats$metrics$libbea8 = stats === null || stats === void 0 ? void 0 : (_stats$metrics8 = stats.metrics) === null || _stats$metrics8 === void 0 ? void 0 : (_stats$metrics8$libbe = _stats$metrics8.libbeat) === null || _stats$metrics8$libbe === void 0 ? void 0 : (_stats$metrics8$libbe2 = _stats$metrics8$libbe.config) === null || _stats$metrics8$libbe2 === void 0 ? void 0 : _stats$metrics8$libbe2.reloads) !== null && _stats$metrics$libbea8 !== void 0 ? _stats$metrics$libbea8 : null,
    uptime: (_stats$metrics$beat$i = stats === null || stats === void 0 ? void 0 : (_stats$metrics9 = stats.metrics) === null || _stats$metrics9 === void 0 ? void 0 : (_stats$metrics9$beat = _stats$metrics9.beat) === null || _stats$metrics9$beat === void 0 ? void 0 : (_stats$metrics9$beat$ = _stats$metrics9$beat.info) === null || _stats$metrics9$beat$ === void 0 ? void 0 : (_stats$metrics9$beat$2 = _stats$metrics9$beat$.uptime) === null || _stats$metrics9$beat$2 === void 0 ? void 0 : _stats$metrics9$beat$2.ms) !== null && _stats$metrics$beat$i !== void 0 ? _stats$metrics$beat$i : null,
    eventsTotal: (_getDiffCalculation = (0, _beats_stats.getDiffCalculation)(eventsTotalLast, eventsTotalFirst)) !== null && _getDiffCalculation !== void 0 ? _getDiffCalculation : null,
    eventsEmitted: (_getDiffCalculation2 = (0, _beats_stats.getDiffCalculation)(eventsEmittedLast, eventsEmittedFirst)) !== null && _getDiffCalculation2 !== void 0 ? _getDiffCalculation2 : null,
    eventsDropped: (_getDiffCalculation3 = (0, _beats_stats.getDiffCalculation)(eventsDroppedLast, eventsDroppedFirst)) !== null && _getDiffCalculation3 !== void 0 ? _getDiffCalculation3 : null,
    bytesWritten: (_getDiffCalculation4 = (0, _beats_stats.getDiffCalculation)(bytesWrittenLast, bytesWrittenFirst)) !== null && _getDiffCalculation4 !== void 0 ? _getDiffCalculation4 : null,
    handlesHardLimit,
    handlesSoftLimit
  };
}

async function getBeatSummary(req, beatsIndexPattern, {
  clusterUuid,
  beatUuid,
  start,
  end
}) {
  (0, _error_missing_required.checkParam)(beatsIndexPattern, 'beatsIndexPattern in beats/getBeatSummary');
  const filters = [{
    term: {
      'beats_stats.beat.uuid': beatUuid
    }
  }];
  const params = {
    index: beatsIndexPattern,
    size: 1,
    ignoreUnavailable: true,
    filterPath: ['hits.hits._source.beats_stats.beat.host', 'hits.hits._source.beats_stats.beat.version', 'hits.hits._source.beats_stats.beat.name', 'hits.hits._source.beats_stats.beat.type', 'hits.hits._source.beats_stats.metrics.libbeat.output.type', 'hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.published', 'hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.total', 'hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.dropped', 'hits.hits._source.beats_stats.metrics.libbeat.output.write.bytes', 'hits.hits._source.beats_stats.metrics.libbeat.config.reloads', 'hits.hits._source.beats_stats.metrics.beat.info.uptime.ms', 'hits.hits._source.beats_stats.metrics.beat.handles.limit.hard', 'hits.hits._source.beats_stats.metrics.beat.handles.limit.soft', 'hits.hits.inner_hits.first_hit.hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.published', 'hits.hits.inner_hits.first_hit.hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.total', 'hits.hits.inner_hits.first_hit.hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.dropped', 'hits.hits.inner_hits.first_hit.hits.hits._source.beats_stats.metrics.libbeat.output.write.bytes'],
    body: {
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: (0, _create_beats_query.createBeatsQuery)({
        start,
        end,
        clusterUuid,
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
  const response = await callWithRequest(req, 'search', params);
  return handleResponse(response, beatUuid);
}
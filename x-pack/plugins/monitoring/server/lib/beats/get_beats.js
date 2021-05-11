"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.getBeats = getBeats;

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _create_beats_query = require("./create_beats_query");

var _calculate_rate = require("../calculate_rate");

var _beats_stats = require("./_beats_stats");

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
// @ts-ignore


function handleResponse(response, start, end) {
  var _response$hits$hits, _response$hits;

  const hits = (_response$hits$hits = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits) !== null && _response$hits$hits !== void 0 ? _response$hits$hits : [];
  const initial = {
    ids: new Set(),
    beats: []
  };
  const {
    beats
  } = hits.reduce((accum, hit) => {
    var _stats$beat, _hit$inner_hits, _hit$inner_hits$earli, _hit$inner_hits$earli2, _hit$inner_hits2, _hit$inner_hits2$earl, _hit$inner_hits2$earl2, _earliestStats, _stats$metrics, _stats$metrics$libbea, _stats$metrics$libbea2, _stats$metrics$libbea3, _earliestStats2, _earliestStats2$metri, _earliestStats2$metri2, _earliestStats2$metri3, _earliestStats2$metri4, _stats$metrics2, _stats$metrics2$libbe, _stats$metrics2$libbe2, _stats$metrics2$libbe3, _earliestStats3, _earliestStats3$metri, _earliestStats3$metri2, _earliestStats3$metri3, _earliestStats3$metri4, _stats$metrics$libbea4, _stats$metrics3, _stats$metrics3$libbe, _stats$metrics3$libbe2, _stats$metrics3$libbe3, _earliestStats$metric, _earliestStats4, _earliestStats4$metri, _earliestStats4$metri2, _earliestStats4$metri3, _earliestStats4$metri4, _stats$metrics$libbea5, _stats$metrics4, _stats$metrics4$libbe, _stats$metrics4$libbe2, _stats$metrics4$libbe3, _earliestStats$metric2, _earliestStats5, _earliestStats5$metri, _earliestStats5$metri2, _earliestStats5$metri3, _earliestStats5$metri4, _stats$beat2, _stats$beat3, _stats$beat4, _stats$metrics5, _stats$metrics5$libbe, _stats$metrics5$libbe2, _stats$metrics6, _stats$metrics6$beat, _stats$metrics6$beat$, _stats$beat5;

    const stats = hit._source.beats_stats;
    const uuid = stats === null || stats === void 0 ? void 0 : (_stats$beat = stats.beat) === null || _stats$beat === void 0 ? void 0 : _stats$beat.uuid;

    if (!uuid) {
      return accum;
    } // skip this duplicated beat, newer one was already added


    if (accum.ids.has(uuid)) {
      return accum;
    } // add another beat summary


    accum.ids.add(uuid);
    let earliestStats = null;

    if ((_hit$inner_hits = hit.inner_hits) !== null && _hit$inner_hits !== void 0 && (_hit$inner_hits$earli = _hit$inner_hits.earliest) !== null && _hit$inner_hits$earli !== void 0 && (_hit$inner_hits$earli2 = _hit$inner_hits$earli.hits) !== null && _hit$inner_hits$earli2 !== void 0 && _hit$inner_hits$earli2.hits && ((_hit$inner_hits2 = hit.inner_hits) === null || _hit$inner_hits2 === void 0 ? void 0 : (_hit$inner_hits2$earl = _hit$inner_hits2.earliest) === null || _hit$inner_hits2$earl === void 0 ? void 0 : (_hit$inner_hits2$earl2 = _hit$inner_hits2$earl.hits) === null || _hit$inner_hits2$earl2 === void 0 ? void 0 : _hit$inner_hits2$earl2.hits.length) > 0 && hit.inner_hits.earliest.hits.hits[0]._source.beats_stats) {
      earliestStats = hit.inner_hits.earliest.hits.hits[0]._source.beats_stats;
    } //  add the beat


    const rateOptions = {
      hitTimestamp: stats === null || stats === void 0 ? void 0 : stats.timestamp,
      earliestHitTimestamp: (_earliestStats = earliestStats) === null || _earliestStats === void 0 ? void 0 : _earliestStats.timestamp,
      timeWindowMin: start,
      timeWindowMax: end
    };
    const {
      rate: bytesSentRate
    } = (0, _calculate_rate.calculateRate)({
      latestTotal: stats === null || stats === void 0 ? void 0 : (_stats$metrics = stats.metrics) === null || _stats$metrics === void 0 ? void 0 : (_stats$metrics$libbea = _stats$metrics.libbeat) === null || _stats$metrics$libbea === void 0 ? void 0 : (_stats$metrics$libbea2 = _stats$metrics$libbea.output) === null || _stats$metrics$libbea2 === void 0 ? void 0 : (_stats$metrics$libbea3 = _stats$metrics$libbea2.write) === null || _stats$metrics$libbea3 === void 0 ? void 0 : _stats$metrics$libbea3.bytes,
      earliestTotal: (_earliestStats2 = earliestStats) === null || _earliestStats2 === void 0 ? void 0 : (_earliestStats2$metri = _earliestStats2.metrics) === null || _earliestStats2$metri === void 0 ? void 0 : (_earliestStats2$metri2 = _earliestStats2$metri.libbeat) === null || _earliestStats2$metri2 === void 0 ? void 0 : (_earliestStats2$metri3 = _earliestStats2$metri2.output) === null || _earliestStats2$metri3 === void 0 ? void 0 : (_earliestStats2$metri4 = _earliestStats2$metri3.write) === null || _earliestStats2$metri4 === void 0 ? void 0 : _earliestStats2$metri4.bytes,
      ...rateOptions
    });
    const {
      rate: totalEventsRate
    } = (0, _calculate_rate.calculateRate)({
      latestTotal: stats === null || stats === void 0 ? void 0 : (_stats$metrics2 = stats.metrics) === null || _stats$metrics2 === void 0 ? void 0 : (_stats$metrics2$libbe = _stats$metrics2.libbeat) === null || _stats$metrics2$libbe === void 0 ? void 0 : (_stats$metrics2$libbe2 = _stats$metrics2$libbe.pipeline) === null || _stats$metrics2$libbe2 === void 0 ? void 0 : (_stats$metrics2$libbe3 = _stats$metrics2$libbe2.events) === null || _stats$metrics2$libbe3 === void 0 ? void 0 : _stats$metrics2$libbe3.total,
      earliestTotal: (_earliestStats3 = earliestStats) === null || _earliestStats3 === void 0 ? void 0 : (_earliestStats3$metri = _earliestStats3.metrics) === null || _earliestStats3$metri === void 0 ? void 0 : (_earliestStats3$metri2 = _earliestStats3$metri.libbeat) === null || _earliestStats3$metri2 === void 0 ? void 0 : (_earliestStats3$metri3 = _earliestStats3$metri2.pipeline) === null || _earliestStats3$metri3 === void 0 ? void 0 : (_earliestStats3$metri4 = _earliestStats3$metri3.events) === null || _earliestStats3$metri4 === void 0 ? void 0 : _earliestStats3$metri4.total,
      ...rateOptions
    });
    const errorsWrittenLatest = (_stats$metrics$libbea4 = stats === null || stats === void 0 ? void 0 : (_stats$metrics3 = stats.metrics) === null || _stats$metrics3 === void 0 ? void 0 : (_stats$metrics3$libbe = _stats$metrics3.libbeat) === null || _stats$metrics3$libbe === void 0 ? void 0 : (_stats$metrics3$libbe2 = _stats$metrics3$libbe.output) === null || _stats$metrics3$libbe2 === void 0 ? void 0 : (_stats$metrics3$libbe3 = _stats$metrics3$libbe2.write) === null || _stats$metrics3$libbe3 === void 0 ? void 0 : _stats$metrics3$libbe3.errors) !== null && _stats$metrics$libbea4 !== void 0 ? _stats$metrics$libbea4 : 0;
    const errorsWrittenEarliest = (_earliestStats$metric = (_earliestStats4 = earliestStats) === null || _earliestStats4 === void 0 ? void 0 : (_earliestStats4$metri = _earliestStats4.metrics) === null || _earliestStats4$metri === void 0 ? void 0 : (_earliestStats4$metri2 = _earliestStats4$metri.libbeat) === null || _earliestStats4$metri2 === void 0 ? void 0 : (_earliestStats4$metri3 = _earliestStats4$metri2.output) === null || _earliestStats4$metri3 === void 0 ? void 0 : (_earliestStats4$metri4 = _earliestStats4$metri3.write) === null || _earliestStats4$metri4 === void 0 ? void 0 : _earliestStats4$metri4.errors) !== null && _earliestStats$metric !== void 0 ? _earliestStats$metric : 0;
    const errorsReadLatest = (_stats$metrics$libbea5 = stats === null || stats === void 0 ? void 0 : (_stats$metrics4 = stats.metrics) === null || _stats$metrics4 === void 0 ? void 0 : (_stats$metrics4$libbe = _stats$metrics4.libbeat) === null || _stats$metrics4$libbe === void 0 ? void 0 : (_stats$metrics4$libbe2 = _stats$metrics4$libbe.output) === null || _stats$metrics4$libbe2 === void 0 ? void 0 : (_stats$metrics4$libbe3 = _stats$metrics4$libbe2.read) === null || _stats$metrics4$libbe3 === void 0 ? void 0 : _stats$metrics4$libbe3.errors) !== null && _stats$metrics$libbea5 !== void 0 ? _stats$metrics$libbea5 : 0;
    const errorsReadEarliest = (_earliestStats$metric2 = (_earliestStats5 = earliestStats) === null || _earliestStats5 === void 0 ? void 0 : (_earliestStats5$metri = _earliestStats5.metrics) === null || _earliestStats5$metri === void 0 ? void 0 : (_earliestStats5$metri2 = _earliestStats5$metri.libbeat) === null || _earliestStats5$metri2 === void 0 ? void 0 : (_earliestStats5$metri3 = _earliestStats5$metri2.output) === null || _earliestStats5$metri3 === void 0 ? void 0 : (_earliestStats5$metri4 = _earliestStats5$metri3.read) === null || _earliestStats5$metri4 === void 0 ? void 0 : _earliestStats5$metri4.errors) !== null && _earliestStats$metric2 !== void 0 ? _earliestStats$metric2 : 0;
    const errors = (0, _beats_stats.getDiffCalculation)(errorsWrittenLatest + errorsReadLatest, errorsWrittenEarliest + errorsReadEarliest);
    accum.beats.push({
      uuid: stats === null || stats === void 0 ? void 0 : (_stats$beat2 = stats.beat) === null || _stats$beat2 === void 0 ? void 0 : _stats$beat2.uuid,
      name: stats === null || stats === void 0 ? void 0 : (_stats$beat3 = stats.beat) === null || _stats$beat3 === void 0 ? void 0 : _stats$beat3.name,
      type: (0, _lodash.upperFirst)(stats === null || stats === void 0 ? void 0 : (_stats$beat4 = stats.beat) === null || _stats$beat4 === void 0 ? void 0 : _stats$beat4.type),
      output: (0, _lodash.upperFirst)(stats === null || stats === void 0 ? void 0 : (_stats$metrics5 = stats.metrics) === null || _stats$metrics5 === void 0 ? void 0 : (_stats$metrics5$libbe = _stats$metrics5.libbeat) === null || _stats$metrics5$libbe === void 0 ? void 0 : (_stats$metrics5$libbe2 = _stats$metrics5$libbe.output) === null || _stats$metrics5$libbe2 === void 0 ? void 0 : _stats$metrics5$libbe2.type),
      total_events_rate: totalEventsRate,
      bytes_sent_rate: bytesSentRate,
      errors,
      memory: stats === null || stats === void 0 ? void 0 : (_stats$metrics6 = stats.metrics) === null || _stats$metrics6 === void 0 ? void 0 : (_stats$metrics6$beat = _stats$metrics6.beat) === null || _stats$metrics6$beat === void 0 ? void 0 : (_stats$metrics6$beat$ = _stats$metrics6$beat.memstats) === null || _stats$metrics6$beat$ === void 0 ? void 0 : _stats$metrics6$beat$.memory_alloc,
      version: stats === null || stats === void 0 ? void 0 : (_stats$beat5 = stats.beat) === null || _stats$beat5 === void 0 ? void 0 : _stats$beat5.version
    });
    return accum;
  }, initial);
  return beats;
}

async function getBeats(req, beatsIndexPattern, clusterUuid) {
  (0, _error_missing_required.checkParam)(beatsIndexPattern, 'beatsIndexPattern in getBeats');
  const config = req.server.config();

  const start = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const end = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const params = {
    index: beatsIndexPattern,
    size: config.get('monitoring.ui.max_bucket_size'),
    // FIXME
    ignoreUnavailable: true,
    filterPath: [// only filter path can filter for inner_hits
    'hits.hits._source.beats_stats.beat.uuid', 'hits.hits._source.beats_stats.beat.name', 'hits.hits._source.beats_stats.beat.host', 'hits.hits._source.beats_stats.beat.type', 'hits.hits._source.beats_stats.beat.version', 'hits.hits._source.beats_stats.metrics.libbeat.output.type', 'hits.hits._source.beats_stats.metrics.libbeat.output.read.errors', 'hits.hits._source.beats_stats.metrics.libbeat.output.write.errors', 'hits.hits._source.beats_stats.metrics.beat.memstats.memory_alloc', // latest hits for calculating metrics
    'hits.hits._source.beats_stats.timestamp', 'hits.hits._source.beats_stats.metrics.libbeat.output.write.bytes', 'hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.total', // earliest hits for calculating metrics
    'hits.hits.inner_hits.earliest.hits.hits._source.beats_stats.timestamp', 'hits.hits.inner_hits.earliest.hits.hits._source.beats_stats.metrics.libbeat.output.write.bytes', 'hits.hits.inner_hits.earliest.hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.total', // earliest hits for calculating diffs
    'hits.hits.inner_hits.earliest.hits.hits._source.beats_stats.metrics.libbeat.output.read.errors', 'hits.hits.inner_hits.earliest.hits.hits._source.beats_stats.metrics.libbeat.output.write.errors'],
    body: {
      query: (0, _create_beats_query.createBeatsQuery)({
        start,
        end,
        clusterUuid
      }),
      collapse: {
        field: 'beats_stats.metrics.beat.info.ephemeral_id',
        // collapse on ephemeral_id to handle restarts
        inner_hits: {
          name: 'earliest',
          size: 1,
          sort: [{
            'beats_stats.timestamp': {
              order: 'asc',
              unmapped_type: 'long'
            }
          }]
        }
      },
      sort: [{
        'beats_stats.beat.uuid': {
          order: 'asc',
          unmapped_type: 'long'
        }
      }, // need to keep duplicate uuids grouped
      {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      } // need oldest timestamp to come first for rate calcs to work
      ]
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const response = await callWithRequest(req, 'search', params);
  return handleResponse(response, start, end);
}
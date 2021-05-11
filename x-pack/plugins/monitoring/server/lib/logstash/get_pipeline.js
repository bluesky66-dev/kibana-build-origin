"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._vertexStats = _vertexStats;
exports._enrichStateWithStatsAggregation = _enrichStateWithStatsAggregation;
exports.getPipeline = getPipeline;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _get_pipeline_state_document = require("./get_pipeline_state_document");

var _get_pipeline_stats_aggregation = require("./get_pipeline_stats_aggregation");

var _calculate_timeseries_interval = require("../calculate_timeseries_interval");

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


function _vertexStats(vertex, vertexStatsBucket, totalProcessorsDurationInMillis, timeseriesIntervalInSeconds) {
  const isInput = vertex.plugin_type === 'input';
  const isProcessor = vertex.plugin_type === 'filter' || vertex.plugin_type === 'output';
  const timeseriesIntervalInMillis = timeseriesIntervalInSeconds * 1000;
  const eventsInTotal = vertexStatsBucket.events_in_total.value;
  const eventsOutTotal = (0, _lodash.get)(vertexStatsBucket, 'events_out_total.value', null);
  const durationInMillis = vertexStatsBucket.duration_in_millis_total.value;
  const processorStats = {};
  const eventsProcessedStats = {
    events_out_per_millisecond: eventsOutTotal / timeseriesIntervalInMillis
  };
  let eventsTotal;

  if (isInput) {
    eventsTotal = eventsOutTotal;
  }

  if (isProcessor) {
    eventsTotal = eventsInTotal;
    processorStats.percent_of_total_processor_duration = durationInMillis / totalProcessorsDurationInMillis;
    eventsProcessedStats.events_in_per_millisecond = eventsInTotal / timeseriesIntervalInMillis;
  }

  return {
    millis_per_event: durationInMillis / eventsTotal,
    ...processorStats,
    ...eventsProcessedStats
  };
}
/**
 * The UI needs a list of all vertices for the requested pipeline version, with each vertex in the list having its timeseries metrics associated with it. The
 * stateDocument object provides the list of vertices while the statsAggregation object provides the latest metrics for each of these vertices.
 * This function stitches the two together and returns the modified stateDocument object.
 *
 * @param {Object} stateDocument
 * @param {Object} statsAggregation
 * @param {Object} First and last seen timestamps for pipeline version we're getting data for
 * @param {Integer} timeseriesIntervalInSeconds The size of each timeseries bucket, in seconds
 */


function _enrichStateWithStatsAggregation(stateDocument, statsAggregation, timeseriesIntervalInSeconds) {
  var _logstashState$pipeli, _logstashState$pipeli2, _logstashState$pipeli3, _logstashState$pipeli4, _stateDocument$logsta;

  const logstashState = stateDocument.logstash_state;
  const vertices = (_logstashState$pipeli = logstashState === null || logstashState === void 0 ? void 0 : (_logstashState$pipeli2 = logstashState.pipeline) === null || _logstashState$pipeli2 === void 0 ? void 0 : (_logstashState$pipeli3 = _logstashState$pipeli2.representation) === null || _logstashState$pipeli3 === void 0 ? void 0 : (_logstashState$pipeli4 = _logstashState$pipeli3.graph) === null || _logstashState$pipeli4 === void 0 ? void 0 : _logstashState$pipeli4.vertices) !== null && _logstashState$pipeli !== void 0 ? _logstashState$pipeli : [];
  const verticesById = {};
  vertices.forEach(vertex => {
    verticesById[vertex.id] = vertex;
    vertex.stats = {};
  });
  const totalDurationStats = statsAggregation.aggregations.pipelines.scoped.total_processor_duration_stats;
  const totalProcessorsDurationInMillis = totalDurationStats.max - totalDurationStats.min;
  const verticesWithStatsBuckets = statsAggregation.aggregations.pipelines.scoped.vertices.vertex_id.buckets;
  verticesWithStatsBuckets.forEach(vertexStatsBucket => {
    // Each vertexStats bucket contains a list of stats for a single vertex within a single timeseries interval
    const vertexId = vertexStatsBucket.key;
    const vertex = verticesById[vertexId];

    if (vertex !== undefined) {
      // We extract this vertex's stats from vertexStatsBucket
      vertex.stats = _vertexStats(vertex, vertexStatsBucket, totalProcessorsDurationInMillis, timeseriesIntervalInSeconds);
    }
  });
  return (_stateDocument$logsta = stateDocument.logstash_state) === null || _stateDocument$logsta === void 0 ? void 0 : _stateDocument$logsta.pipeline;
}

async function getPipeline(req, config, lsIndexPattern, clusterUuid, pipelineId, version) {
  (0, _error_missing_required.checkParam)(lsIndexPattern, 'lsIndexPattern in getPipeline');
  const options = {
    clusterUuid,
    pipelineId,
    version
  }; // Determine metrics' timeseries interval based on version's timespan

  const minIntervalSeconds = config.get('monitoring.ui.min_interval_seconds');
  const timeseriesInterval = (0, _calculate_timeseries_interval.calculateTimeseriesInterval)(version.firstSeen, version.lastSeen, minIntervalSeconds);
  const [stateDocument, statsAggregation] = await Promise.all([(0, _get_pipeline_state_document.getPipelineStateDocument)(req, lsIndexPattern, options), (0, _get_pipeline_stats_aggregation.getPipelineStatsAggregation)(req, lsIndexPattern, timeseriesInterval, options)]);

  if (stateDocument === null) {
    return _boom.default.notFound(`Pipeline [${pipelineId} @ ${version.hash}] not found in the selected time range for cluster [${clusterUuid}].`);
  }

  return _enrichStateWithStatsAggregation(stateDocument, statsAggregation, timeseriesInterval);
}
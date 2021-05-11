"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._vertexStats = _vertexStats;
exports._enrichVertexStateWithStatsAggregation = _enrichVertexStateWithStatsAggregation;
exports.getPipelineVertex = getPipelineVertex;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _get_pipeline_state_document = require("./get_pipeline_state_document");

var _get_pipeline_vertex_stats_aggregation = require("./get_pipeline_vertex_stats_aggregation");

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
  const inputStats = {};
  const processorStats = {};
  const eventsProcessedStats = {
    events_out_per_millisecond: eventsOutTotal / timeseriesIntervalInMillis
  };
  let eventsTotal;

  if (isInput) {
    eventsTotal = eventsOutTotal;
    inputStats.queue_push_duration_in_millis = vertexStatsBucket.queue_push_duration_in_millis_total.value;
    inputStats.queue_push_duration_in_millis_per_event = inputStats.queue_push_duration_in_millis / eventsTotal;
  }

  if (isProcessor) {
    eventsTotal = eventsInTotal;
    processorStats.percent_of_total_processor_duration = durationInMillis / totalProcessorsDurationInMillis;
    eventsProcessedStats.events_in_per_millisecond = eventsInTotal / timeseriesIntervalInMillis;
  }

  return {
    events_in: eventsInTotal,
    events_out: eventsOutTotal,
    duration_in_millis: durationInMillis,
    millis_per_event: durationInMillis / eventsTotal,
    ...inputStats,
    ...processorStats,
    ...eventsProcessedStats
  };
}
/**
 * The UI needs a list of all vertices for the requested pipeline version, with each vertex in the list having its timeseries metrics associated with it. The
 * stateDocument object provides the list of vertices while the statsAggregation object provides the timeseries metrics for each of these vertices.
 * This function stitches the two together and returns the modified stateDocument object.
 *
 * @param {Object} stateDocument
 * @param {Object} vertexStatsAggregation
 * @param {Object} First and last seen timestamps for pipeline version we're getting data for
 * @param {Integer} timeseriesIntervalInSeconds The size of each timeseries bucket, in seconds
 */


function _enrichVertexStateWithStatsAggregation(stateDocument, vertexStatsAggregation, vertexId, timeseriesIntervalInSeconds) {
  var _logstashState$pipeli, _logstashState$pipeli2, _logstashState$pipeli3;

  const logstashState = stateDocument.logstash_state;
  const vertices = logstashState === null || logstashState === void 0 ? void 0 : (_logstashState$pipeli = logstashState.pipeline) === null || _logstashState$pipeli === void 0 ? void 0 : (_logstashState$pipeli2 = _logstashState$pipeli.representation) === null || _logstashState$pipeli2 === void 0 ? void 0 : (_logstashState$pipeli3 = _logstashState$pipeli2.graph) === null || _logstashState$pipeli3 === void 0 ? void 0 : _logstashState$pipeli3.vertices; // First, filter out the vertex we care about

  const vertex = vertices === null || vertices === void 0 ? void 0 : vertices.find(v => v.id === vertexId);

  if (vertex) {
    vertex.stats = {};
  } // Next, iterate over timeseries metrics and attach them to vertex


  const timeSeriesBuckets = vertexStatsAggregation.aggregations.timeseries.buckets;
  timeSeriesBuckets.forEach(timeSeriesBucket => {
    // each bucket calculates stats for total pipeline CPU time for the associated timeseries
    const totalDurationStats = timeSeriesBucket.pipelines.scoped.total_processor_duration_stats;
    const totalProcessorsDurationInMillis = totalDurationStats.max - totalDurationStats.min;
    const timestamp = timeSeriesBucket.key;
    const vertexStatsBucket = timeSeriesBucket.pipelines.scoped.vertices.vertex_id;

    if (vertex) {
      const vertexStats = _vertexStats(vertex, vertexStatsBucket, totalProcessorsDurationInMillis, timeseriesIntervalInSeconds);

      Object.keys(vertexStats).forEach(stat => {
        if (vertex !== null && vertex !== void 0 && vertex.stats) {
          var _vertex$stats$stat$da;

          if (!vertex.stats.hasOwnProperty(stat)) {
            vertex.stats[stat] = {
              data: []
            };
          }

          (_vertex$stats$stat$da = vertex.stats[stat].data) === null || _vertex$stats$stat$da === void 0 ? void 0 : _vertex$stats$stat$da.push([timestamp, vertexStats[stat]]);
        }
      });
    }
  });
  return vertex;
}

async function getPipelineVertex(req, config, lsIndexPattern, clusterUuid, pipelineId, version, vertexId) {
  (0, _error_missing_required.checkParam)(lsIndexPattern, 'lsIndexPattern in getPipeline');
  const options = {
    clusterUuid,
    pipelineId,
    version,
    vertexId
  }; // Determine metrics' timeseries interval based on version's timespan

  const minIntervalSeconds = config.get('monitoring.ui.min_interval_seconds');
  const timeseriesInterval = (0, _calculate_timeseries_interval.calculateTimeseriesInterval)(version.firstSeen, version.lastSeen, minIntervalSeconds);
  const [stateDocument, statsAggregation] = await Promise.all([(0, _get_pipeline_state_document.getPipelineStateDocument)(req, lsIndexPattern, options), (0, _get_pipeline_vertex_stats_aggregation.getPipelineVertexStatsAggregation)(req, lsIndexPattern, timeseriesInterval, options)]);

  if (stateDocument === null) {
    return _boom.default.notFound(`Pipeline [${pipelineId} @ ${version.hash}] not found in the selected time range for cluster [${clusterUuid}].`);
  }

  return _enrichVertexStateWithStatsAggregation(stateDocument, statsAggregation, vertexId, timeseriesInterval);
}
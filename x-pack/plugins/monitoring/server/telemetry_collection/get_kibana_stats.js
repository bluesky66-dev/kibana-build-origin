"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rollUpTotals = rollUpTotals;
exports.rollUpIndices = rollUpIndices;
exports.getUsageStats = getUsageStats;
exports.combineStats = combineStats;
exports.ensureTimeSpan = ensureTimeSpan;
exports.getKibanaStats = getKibanaStats;

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

var _constants = require("../../common/constants");

var _get_high_level_stats = require("./get_high_level_stats");

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


function rollUpTotals(rolledUp, addOn, field) {
  var _rolledUp$field, _addOn$field;

  const rolledUpTotal = ((_rolledUp$field = rolledUp[field]) === null || _rolledUp$field === void 0 ? void 0 : _rolledUp$field.total) || 0;
  const addOnTotal = ((_addOn$field = addOn[field]) === null || _addOn$field === void 0 ? void 0 : _addOn$field.total) || 0;
  return {
    total: rolledUpTotal + addOnTotal
  };
}

function rollUpIndices(rolledUp) {
  return rolledUp.indices + 1;
}
/*
 * @param {Object} rawStats
 */


function getUsageStats(rawStats) {
  var _rawStats$hits;

  const clusterIndexCache = new Set();
  const rawStatsHits = ((_rawStats$hits = rawStats.hits) === null || _rawStats$hits === void 0 ? void 0 : _rawStats$hits.hits) || []; // get usage stats per cluster / .kibana index

  return rawStatsHits.reduce((accum, currInstance) => {
    var _currInstance$_source;

    const clusterUuid = currInstance._source.cluster_uuid;
    const currUsage = ((_currInstance$_source = currInstance._source.kibana_stats) === null || _currInstance$_source === void 0 ? void 0 : _currInstance$_source.usage) || {};
    const clusterIndexCombination = clusterUuid + currUsage.index; // return early if usage data is empty or if this cluster/index has already been processed

    if ((0, _lodash.isEmpty)(currUsage) || clusterIndexCache.has(clusterIndexCombination)) {
      return accum;
    }

    clusterIndexCache.add(clusterIndexCombination); // Get the stats that were read from any number of different .kibana indices in the cluster,
    // roll them up into cluster-wide totals

    const rolledUpStats = accum[clusterUuid] || {
      indices: 0
    };
    const stats = {
      dashboard: rollUpTotals(rolledUpStats, currUsage, 'dashboard'),
      visualization: rollUpTotals(rolledUpStats, currUsage, 'visualization'),
      search: rollUpTotals(rolledUpStats, currUsage, 'search'),
      index_pattern: rollUpTotals(rolledUpStats, currUsage, 'index_pattern'),
      graph_workspace: rollUpTotals(rolledUpStats, currUsage, 'graph_workspace'),
      timelion_sheet: rollUpTotals(rolledUpStats, currUsage, 'timelion_sheet'),
      indices: rollUpIndices(rolledUpStats)
    }; // Get the stats provided by telemetry collectors.

    const {
      index,
      dashboard,
      visualization,
      search,

      /* eslint-disable @typescript-eslint/naming-convention */
      index_pattern,
      graph_workspace,
      timelion_sheet,

      /* eslint-enable @typescript-eslint/naming-convention */
      xpack,
      ...pluginsTop
    } = currUsage; // Stats filtered by telemetry collectors need to be flattened since they're pulled in a generic way.
    // e.g: we want `xpack.reporting` to just be `reporting`

    const plugins = { ...pluginsTop,
      ...xpack
    };
    return { ...accum,
      [clusterUuid]: { ...stats,
        plugins
      }
    };
  }, {});
}

function combineStats(highLevelStats, usageStats = {}) {
  return Object.keys(highLevelStats).reduce((accum, currClusterUuid) => {
    return { ...accum,
      [currClusterUuid]: { ...highLevelStats[currClusterUuid],
        ...usageStats[currClusterUuid]
      }
    };
  }, {});
}
/**
 * Ensure the start and end dates are, at least, TELEMETRY_COLLECTION_INTERVAL apart
 * because, otherwise, we are sending telemetry with empty Kibana usage data.
 *
 * @param {string} [start] The start time (in ISO string format) from which to get the telemetry data
 * @param {string} [end] The end time (in ISO string format) from which to get the telemetry data
 */


function ensureTimeSpan(start, end) {
  // We only care if we have a start date, because that's the limit that might make us lose the document
  if (start) {
    const duration = _moment.default.duration(_constants.TELEMETRY_COLLECTION_INTERVAL, 'milliseconds'); // If end exists, we need to ensure they are, at least, TELEMETRY_COLLECTION_INTERVAL apart.
    // Otherwise start should be, at least, TELEMETRY_COLLECTION_INTERVAL apart from now


    let safeStart = (0, _moment.default)().subtract(duration);

    if (end) {
      safeStart = (0, _moment.default)(end).subtract(duration);
    }

    if (safeStart.isBefore(start)) {
      return {
        start: safeStart.toISOString(),
        end
      };
    }
  }

  return {
    start,
    end
  };
}
/*
 * Monkey-patch the modules from get_high_level_stats and add in the
 * specialized usage data that comes with kibana stats (kibana_stats.usage).
 */


async function getKibanaStats(callCluster, clusterUuids, start, end, maxBucketSize) {
  const {
    start: safeStart,
    end: safeEnd
  } = ensureTimeSpan(start, end);
  const rawStats = await (0, _get_high_level_stats.fetchHighLevelStats)(callCluster, clusterUuids, safeStart, safeEnd, _constants.KIBANA_SYSTEM_ID, maxBucketSize);
  const highLevelStats = (0, _get_high_level_stats.handleHighLevelStatsResponse)(rawStats, _constants.KIBANA_SYSTEM_ID);
  const usageStats = getUsageStats(rawStats);
  const stats = combineStats(highLevelStats, usageStats);
  return stats;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.getLatestStats = getLatestStats;

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _create_beats_query = require("./create_beats_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function handleResponse(response) {
  const aggs = (0, _lodash.get)(response, 'aggregations');

  const getTimeRangeCount = name => {
    const lastActiveBuckets = (0, _lodash.get)(aggs, 'active_counts.buckets', []);
    const rangeBucket = lastActiveBuckets.find(bucket => bucket.key === name);
    return (0, _lodash.get)(rangeBucket, 'uuids.buckets.length');
  }; // aggregations are not ordered, so we find the bucket for each timestamp range
  // counts are the number of uuid bucket in the inner aggregation


  const last1mCount = getTimeRangeCount('last1m');
  const last5mCount = getTimeRangeCount('last5m');
  const last20mCount = getTimeRangeCount('last20m');
  const last1hCount = getTimeRangeCount('last1h');
  const last1dCount = getTimeRangeCount('last1d');
  const latestActive = [{
    range: 'last1m',
    count: last1mCount
  }, {
    range: 'last5m',
    count: last5mCount
  }, {
    range: 'last20m',
    count: last20mCount
  }, {
    range: 'last1h',
    count: last1hCount
  }, {
    range: 'last1d',
    count: last1dCount
  }];
  const latestVersions = (0, _lodash.get)(aggs, 'versions.buckets', []).reduce((accum, current) => {
    return [...accum, {
      version: current.key,
      count: (0, _lodash.get)(current, 'uuids.buckets.length')
    }];
  }, []);
  const latestTypes = (0, _lodash.get)(aggs, 'types.buckets', []).reduce((accum, current) => {
    return [...accum, {
      type: (0, _lodash.upperFirst)(current.key),
      count: (0, _lodash.get)(current, 'uuids.buckets.length')
    }];
  }, []);
  return {
    latestActive,
    latestVersions,
    latestTypes
  };
}

function getLatestStats(req, beatsIndexPattern, clusterUuid) {
  (0, _error_missing_required.checkParam)(beatsIndexPattern, 'beatsIndexPattern in getBeats');
  const config = req.server.config();
  const lastDayFilter = {
    range: {
      timestamp: {
        gte: 'now-1d/d',
        lte: 'now/d'
      }
    }
  };
  const beatUuidAgg = {
    // size of these buckets determines actual # of beats in each kind of aggregation
    aggs: {
      uuids: {
        terms: {
          field: 'beats_stats.beat.uuid',
          size: config.get('monitoring.ui.max_bucket_size')
        }
      }
    }
  };
  const params = {
    index: beatsIndexPattern,
    size: 0,
    ignoreUnavailable: true,
    filterPath: 'aggregations',
    body: {
      query: (0, _create_beats_query.createBeatsQuery)({
        clusterUuid,
        filters: [lastDayFilter]
      }),
      aggs: {
        active_counts: {
          date_range: {
            field: 'timestamp',
            ranges: [{
              key: 'last1m',
              from: 'now-1m/m',
              to: 'now'
            }, {
              key: 'last5m',
              from: 'now-5m/m',
              to: 'now'
            }, {
              key: 'last20m',
              from: 'now-20m/m',
              to: 'now'
            }, {
              key: 'last1h',
              from: 'now-1h/h',
              to: 'now'
            }, {
              key: 'last1d',
              from: 'now-1d/d',
              to: 'now'
            }]
          },
          ...beatUuidAgg
        },
        versions: {
          terms: {
            field: 'beats_stats.beat.version',
            size: 5
          },
          ...beatUuidAgg
        },
        types: {
          terms: {
            field: 'beats_stats.beat.type',
            size: 5
          },
          ...beatUuidAgg
        }
      }
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(handleResponse);
}
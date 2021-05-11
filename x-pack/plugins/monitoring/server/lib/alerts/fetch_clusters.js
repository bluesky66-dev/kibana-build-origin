"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchClusters = fetchClusters;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function fetchClusters(callCluster, index, rangeFilter = {
  timestamp: {
    gte: 'now-2m'
  }
}) {
  const params = {
    index,
    filterPath: ['hits.hits._source.cluster_settings.cluster.metadata.display_name', 'hits.hits._source.cluster_uuid', 'hits.hits._source.cluster_name'],
    body: {
      size: 1000,
      query: {
        bool: {
          filter: [{
            term: {
              type: 'cluster_stats'
            }
          }, {
            range: rangeFilter
          }]
        }
      },
      collapse: {
        field: 'cluster_uuid'
      }
    }
  };
  const response = await callCluster('search', params);
  return (0, _lodash.get)(response, 'hits.hits', []).map(hit => {
    const clusterName = (0, _lodash.get)(hit, '_source.cluster_settings.cluster.metadata.display_name') || (0, _lodash.get)(hit, '_source.cluster_name') || (0, _lodash.get)(hit, '_source.cluster_uuid');
    return {
      clusterUuid: (0, _lodash.get)(hit, '_source.cluster_uuid'),
      clusterName
    };
  });
}
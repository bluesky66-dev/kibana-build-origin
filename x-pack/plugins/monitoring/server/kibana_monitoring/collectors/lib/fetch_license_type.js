"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchLicenseType = fetchLicenseType;

var _lodash = require("lodash");

var _constants = require("../../../../common/constants");

var _get_ccs_index_pattern = require("../../../lib/alerts/get_ccs_index_pattern");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function fetchLicenseType(callCluster, availableCcs, clusterUuid) {
  let index = _constants.INDEX_PATTERN_ELASTICSEARCH;

  if (availableCcs) {
    index = (0, _get_ccs_index_pattern.getCcsIndexPattern)(index, availableCcs);
  }

  const params = {
    index,
    filterPath: ['hits.hits._source.license'],
    body: {
      size: 1,
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      query: {
        bool: {
          must: [{
            term: {
              cluster_uuid: {
                value: clusterUuid
              }
            }
          }, {
            term: {
              type: {
                value: 'cluster_stats'
              }
            }
          }]
        }
      }
    }
  };
  const response = await callCluster('search', params);
  return (0, _lodash.get)(response, 'hits.hits[0]._source.license.type', null);
}
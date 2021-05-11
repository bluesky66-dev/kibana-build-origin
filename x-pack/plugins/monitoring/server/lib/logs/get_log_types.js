"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogTypes = getLogTypes;

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _create_query = require("../create_query");

var _detect_reason = require("./detect_reason");

var _detect_reason_from_exception = require("./detect_reason_from_exception");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function handleResponse(response, req, filebeatIndexPattern, opts) {
  const result = {
    enabled: false,
    types: []
  };
  const typeBuckets = (0, _lodash.get)(response, 'aggregations.types.buckets', []);

  if (typeBuckets.length) {
    result.enabled = true;
    result.types = typeBuckets.map(typeBucket => {
      return {
        type: typeBucket.key.split('.')[1],
        levels: typeBucket.levels.buckets.map(levelBucket => {
          return {
            level: levelBucket.key.toLowerCase(),
            count: levelBucket.doc_count
          };
        })
      };
    });
  } else {
    result.reason = await (0, _detect_reason.detectReason)(req, filebeatIndexPattern, opts);
  }

  return result;
}

async function getLogTypes(req, filebeatIndexPattern, {
  clusterUuid,
  nodeUuid,
  indexUuid,
  start,
  end
}) {
  (0, _error_missing_required.checkParam)(filebeatIndexPattern, 'filebeatIndexPattern in logs/getLogTypes');
  const metric = {
    timestampField: '@timestamp'
  };
  const filter = [{
    term: {
      'service.type': 'elasticsearch'
    }
  }, (0, _create_query.createTimeFilter)({
    start,
    end,
    metric
  })];

  if (clusterUuid) {
    filter.push({
      term: {
        'elasticsearch.cluster.uuid': clusterUuid
      }
    });
  }

  if (nodeUuid) {
    filter.push({
      term: {
        'elasticsearch.node.id': nodeUuid
      }
    });
  }

  if (indexUuid) {
    filter.push({
      term: {
        'elasticsearch.index.name': indexUuid
      }
    });
  }

  const params = {
    index: filebeatIndexPattern,
    size: 0,
    filterPath: ['aggregations.levels.buckets', 'aggregations.types.buckets'],
    ignoreUnavailable: true,
    body: {
      sort: {
        '@timestamp': {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: {
        bool: {
          filter
        }
      },
      aggs: {
        types: {
          terms: {
            field: 'event.dataset'
          },
          aggs: {
            levels: {
              terms: {
                field: 'log.level'
              }
            }
          }
        }
      }
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  let result = {};

  try {
    const response = await callWithRequest(req, 'search', params);
    result = await handleResponse(response, req, filebeatIndexPattern, {
      clusterUuid,
      nodeUuid,
      indexUuid,
      start,
      end
    });
  } catch (err) {
    result.reason = (0, _detect_reason_from_exception.detectReasonFromException)(err);
  }

  return result;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createV1SearchResponse = createV1SearchResponse;
exports.createV2SearchResponse = createV2SearchResponse;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createV1SearchResponse(hostMetadata) {
  return {
    took: 15,
    timed_out: false,
    _shards: {
      total: 1,
      successful: 1,
      skipped: 0,
      failed: 0
    },
    hits: {
      total: {
        value: 5,
        relation: 'eq'
      },
      max_score: null,
      hits: hostMetadata ? [{
        _index: 'metrics-endpoint.metadata-default',
        _id: '8FhM0HEBYyRTvb6lOQnw',
        _score: null,
        _source: hostMetadata,
        sort: [1588337587997],
        inner_hits: {
          most_recent: {
            hits: {
              total: {
                value: 2,
                relation: 'eq'
              },
              max_score: null,
              hits: [{
                _index: 'metrics-endpoint.metadata-default',
                _id: 'W6Vo1G8BYQH1gtPUgYkC',
                _score: null,
                _source: hostMetadata,
                sort: [1579816615336]
              }]
            }
          }
        }
      }] : []
    },
    aggregations: {
      total: {
        value: 1
      }
    }
  };
}

function createV2SearchResponse(hostMetadata) {
  return {
    took: 15,
    timed_out: false,
    _shards: {
      total: 1,
      successful: 1,
      skipped: 0,
      failed: 0
    },
    hits: {
      total: {
        value: 1,
        relation: 'eq'
      },
      max_score: null,
      hits: hostMetadata ? [{
        _index: 'metrics-endpoint.metadata-default',
        _id: '8FhM0HEBYyRTvb6lOQnw',
        _score: null,
        _source: { ...hostMetadata
        },
        sort: [1588337587997]
      }] : []
    }
  };
}
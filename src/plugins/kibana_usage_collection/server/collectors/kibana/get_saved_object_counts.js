"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSavedObjectsCounts = getSavedObjectsCounts;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Moved from /x-pack/plugins/monitoring/server/kibana_monitoring/collectors/get_kibana_usage_collector.ts
 *
 * The PR https://github.com/elastic/kibana/pull/62665 proved what the issue https://github.com/elastic/kibana/issues/58249
 * was claiming: the structure and payload for common telemetry bits differs between Monitoring and OSS/X-Pack collections.
 *
 * Unifying this logic from Monitoring that makes sense to have in OSS here and we will import it on the monitoring side to reuse it.
 */
const TYPES = ['dashboard', 'visualization', 'search', 'index-pattern', 'graph-workspace', 'timelion-sheet'];

async function getSavedObjectsCounts(esClient, kibanaIndex) {
  var _body$aggregations, _body$aggregations$ty;

  const savedObjectCountSearchParams = {
    index: kibanaIndex,
    ignoreUnavailable: true,
    filterPath: 'aggregations.types.buckets',
    body: {
      size: 0,
      query: {
        terms: {
          type: TYPES
        }
      },
      aggs: {
        types: {
          terms: {
            field: 'type',
            size: TYPES.length
          }
        }
      }
    }
  };
  const {
    body
  } = await esClient.search(savedObjectCountSearchParams);
  const buckets = ((_body$aggregations = body.aggregations) === null || _body$aggregations === void 0 ? void 0 : (_body$aggregations$ty = _body$aggregations.types) === null || _body$aggregations$ty === void 0 ? void 0 : _body$aggregations$ty.buckets) || []; // Initialise the object with all zeros for all the types

  const allZeros = TYPES.reduce((acc, type) => ({ ...acc,
    [(0, _lodash.snakeCase)(type)]: {
      total: 0
    }
  }), {}); // Add the doc_count from each bucket

  return buckets.reduce((acc, {
    key,
    doc_count: total
  }) => total ? { ...acc,
    [(0, _lodash.snakeCase)(key)]: {
      total
    }
  } : acc, allZeros);
}
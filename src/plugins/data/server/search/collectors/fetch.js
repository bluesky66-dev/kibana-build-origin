"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchProvider = fetchProvider;

var _operators = require("rxjs/operators");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function fetchProvider(config$) {
  return async ({
    esClient
  }) => {
    var _esResponse$hits$hits, _esResponse$hits, _esResponse$hits$hits2;

    const config = await config$.pipe((0, _operators.first)()).toPromise();
    const {
      body: esResponse
    } = await esClient.search({
      index: config.kibana.index,
      body: {
        query: {
          term: {
            type: {
              value: 'search-telemetry'
            }
          }
        }
      }
    }, {
      ignore: [404]
    });
    const size = (_esResponse$hits$hits = esResponse === null || esResponse === void 0 ? void 0 : (_esResponse$hits = esResponse.hits) === null || _esResponse$hits === void 0 ? void 0 : (_esResponse$hits$hits2 = _esResponse$hits.hits) === null || _esResponse$hits$hits2 === void 0 ? void 0 : _esResponse$hits$hits2.length) !== null && _esResponse$hits$hits !== void 0 ? _esResponse$hits$hits : 0;

    if (!size) {
      return {
        successCount: 0,
        errorCount: 0,
        averageDuration: null
      };
    }

    const {
      successCount,
      errorCount,
      totalDuration
    } = esResponse.hits.hits[0]._source['search-telemetry'];
    const averageDuration = totalDuration / successCount;
    return {
      successCount,
      errorCount,
      averageDuration
    };
  };
}
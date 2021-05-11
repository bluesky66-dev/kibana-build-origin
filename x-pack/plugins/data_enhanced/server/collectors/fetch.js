"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchProvider = fetchProvider;

var _operators = require("rxjs/operators");

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function fetchProvider(config$, logger) {
  return async ({
    esClient
  }) => {
    try {
      const config = await config$.pipe((0, _operators.first)()).toPromise();
      const {
        body: esResponse
      } = await esClient.search({
        index: config.kibana.index,
        body: {
          size: 0,
          aggs: {
            persisted: {
              terms: {
                field: `${_common.SEARCH_SESSION_TYPE}.persisted`
              }
            }
          }
        }
      });
      const {
        buckets
      } = esResponse.aggregations.persisted;

      if (!buckets.length) {
        return {
          transientCount: 0,
          persistedCount: 0,
          totalCount: 0
        };
      }

      const {
        transientCount = 0,
        persistedCount = 0
      } = buckets.reduce((usage, bucket) => {
        const key = bucket.key_as_string === 'false' ? 'transientCount' : 'persistedCount';
        return { ...usage,
          [key]: bucket.doc_count
        };
      }, {});
      const totalCount = transientCount + persistedCount;
      logger.debug(`fetchProvider | ${persistedCount} persisted | ${transientCount} transient`);
      return {
        transientCount,
        persistedCount,
        totalCount
      };
    } catch (e) {
      logger.warn(`fetchProvider | error | ${e.message}`);
      return {
        transientCount: 0,
        persistedCount: 0,
        totalCount: 0
      };
    }
  };
}
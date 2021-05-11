"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.internalMonitoringCheckRoute = internalMonitoringCheckRoute;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../../../../common/constants");

var _ccs_utils = require("../../../../../lib/ccs_utils");

var _errors = require("../../../../../lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore


const queryBody = {
  size: 0,
  query: {
    bool: {
      must: [{
        range: {
          timestamp: {
            gte: 'now-12h'
          }
        }
      }]
    }
  },
  aggs: {
    types: {
      terms: {
        field: '_index',
        size: 10
      }
    }
  }
};

const checkLatestMonitoringIsLegacy = async (context, index) => {
  const {
    client: esClient
  } = context.core.elasticsearch.legacy;
  const result = await esClient.callAsCurrentUser('search', {
    index,
    body: queryBody
  });
  const {
    aggregations
  } = result;
  const counts = {
    legacyIndicesCount: 0,
    mbIndicesCount: 0
  };

  if (!aggregations) {
    return counts;
  }

  const {
    types: {
      buckets
    }
  } = aggregations;
  counts.mbIndicesCount = buckets.filter(({
    key
  }) => key.includes('-mb-')).length;
  counts.legacyIndicesCount = buckets.length - counts.mbIndicesCount;
  return counts;
};

function internalMonitoringCheckRoute(server, npRoute) {
  npRoute.router.post({
    path: '/api/monitoring/v1/elasticsearch_settings/check/internal_monitoring',
    validate: {
      body: _configSchema.schema.object({
        ccs: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, request, response) => {
    try {
      const typeCount = {
        legacy_indices: 0,
        mb_indices: 0
      };
      const config = server.config();
      const {
        ccs
      } = request.body;
      const esIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_ELASTICSEARCH, ccs, true);
      const kbnIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_KIBANA, ccs, true);
      const lsIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_LOGSTASH, ccs, true);
      const indexCounts = await Promise.all([checkLatestMonitoringIsLegacy(context, esIndexPattern), checkLatestMonitoringIsLegacy(context, kbnIndexPattern), checkLatestMonitoringIsLegacy(context, lsIndexPattern)]);
      indexCounts.forEach(counts => {
        typeCount.legacy_indices += counts.legacyIndicesCount;
        typeCount.mb_indices += counts.mbIndicesCount;
      });
      return response.ok({
        body: typeCount
      });
    } catch (err) {
      throw (0, _errors.handleError)(err);
    }
  });
}
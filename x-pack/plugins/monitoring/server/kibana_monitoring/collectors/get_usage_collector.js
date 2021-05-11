"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMonitoringUsageCollector = getMonitoringUsageCollector;

var _fetch_available_ccs = require("../../lib/alerts/fetch_available_ccs");

var _get_stack_products_usage = require("./lib/get_stack_products_usage");

var _fetch_license_type = require("./lib/fetch_license_type");

var _constants = require("../../../common/constants");

var _get_ccs_index_pattern = require("../../lib/alerts/get_ccs_index_pattern");

var _fetch_clusters = require("../../lib/alerts/fetch_clusters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getMonitoringUsageCollector(usageCollection, config, legacyEsClient) {
  return usageCollection.makeUsageCollector({
    type: 'monitoring',
    isReady: () => true,
    schema: {
      hasMonitoringData: {
        type: 'boolean'
      },
      clusters: {
        type: 'array',
        items: {
          license: {
            type: 'keyword'
          },
          clusterUuid: {
            type: 'keyword'
          },
          metricbeatUsed: {
            type: 'boolean'
          },
          elasticsearch: {
            enabled: {
              type: 'boolean'
            },
            count: {
              type: 'long'
            },
            metricbeatUsed: {
              type: 'boolean'
            }
          },
          kibana: {
            enabled: {
              type: 'boolean'
            },
            count: {
              type: 'long'
            },
            metricbeatUsed: {
              type: 'boolean'
            }
          },
          logstash: {
            enabled: {
              type: 'boolean'
            },
            count: {
              type: 'long'
            },
            metricbeatUsed: {
              type: 'boolean'
            }
          },
          beats: {
            enabled: {
              type: 'boolean'
            },
            count: {
              type: 'long'
            },
            metricbeatUsed: {
              type: 'boolean'
            }
          },
          apm: {
            enabled: {
              type: 'boolean'
            },
            count: {
              type: 'long'
            },
            metricbeatUsed: {
              type: 'boolean'
            }
          }
        }
      }
    },
    extendFetchContext: {
      kibanaRequest: true
    },
    fetch: async ({
      kibanaRequest
    }) => {
      const callCluster = kibanaRequest ? legacyEsClient.asScoped(kibanaRequest).callAsCurrentUser : legacyEsClient.callAsInternalUser;
      const usageClusters = [];
      const availableCcs = config.ui.ccs.enabled ? await (0, _fetch_available_ccs.fetchAvailableCcs)(callCluster) : [];
      const elasticsearchIndex = (0, _get_ccs_index_pattern.getCcsIndexPattern)(_constants.INDEX_PATTERN_ELASTICSEARCH, availableCcs);
      const clusters = await (0, _fetch_clusters.fetchClusters)(callCluster, elasticsearchIndex);

      for (const cluster of clusters) {
        const license = await (0, _fetch_license_type.fetchLicenseType)(callCluster, availableCcs, cluster.clusterUuid);
        const stackProducts = await (0, _get_stack_products_usage.getStackProductsUsage)(config, callCluster, availableCcs, cluster.clusterUuid);
        usageClusters.push({
          clusterUuid: cluster.clusterUuid,
          license,
          metricbeatUsed: Object.values(stackProducts).some(_usage => _usage.metricbeatUsed),
          ...stackProducts
        });
      }

      const usage = {
        hasMonitoringData: usageClusters.length > 0,
        clusters: usageClusters
      };
      return usage;
    }
  });
}
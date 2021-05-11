"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMonitoringTelemetryCollection = registerMonitoringTelemetryCollection;

var _get_all_stats = require("./get_all_stats");

var _get_cluster_uuids = require("./get_cluster_uuids");

var _get_licenses = require("./get_licenses");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerMonitoringTelemetryCollection(usageCollection, legacyEsClient, maxBucketSize) {
  const monitoringStatsCollector = usageCollection.makeStatsCollector({
    type: 'monitoringTelemetry',
    isReady: () => true,
    ignoreForInternalUploader: true,
    // Used only by monitoring's bulk_uploader to filter out unwanted collectors
    extendFetchContext: {
      kibanaRequest: true
    },
    fetch: async ({
      kibanaRequest
    }) => {
      const timestamp = Date.now(); // Collect the telemetry from the monitoring indices for this moment.
      // NOTE: Usually, the monitoring indices index stats for each product every 10s (by default).
      // However, some data may be delayed up-to 24h because monitoring only collects extended Kibana stats in that interval
      // to avoid overloading of the system when retrieving data from the collectors (that delay is dealt with in the Kibana Stats getter inside the `getAllStats` method).
      // By 8.x, we expect to stop collecting the Kibana extended stats and keep only the monitoring-related metrics.

      const callCluster = kibanaRequest ? legacyEsClient.asScoped(kibanaRequest).callAsCurrentUser : legacyEsClient.callAsInternalUser;
      const clusterDetails = await (0, _get_cluster_uuids.getClusterUuids)(callCluster, timestamp, maxBucketSize);
      const [licenses, stats] = await Promise.all([(0, _get_licenses.getLicenses)(clusterDetails, callCluster, maxBucketSize), (0, _get_all_stats.getAllStats)(clusterDetails, callCluster, timestamp, maxBucketSize)]);
      return stats.map(stat => {
        const license = licenses[stat.cluster_uuid];
        return { ...(license ? {
            license
          } : {}),
          ...stat,
          collectionSource: 'monitoring'
        };
      });
    }
  });
  usageCollection.registerCollector(monitoringStatsCollector);
}
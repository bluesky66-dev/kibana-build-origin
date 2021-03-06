"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flagSupportedClusters = flagSupportedClusters;

var _error_missing_required = require("../error_missing_required");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


async function findSupportedBasicLicenseCluster(req, clusters, kbnIndexPattern, kibanaUuid, serverLog) {
  var _kibanaDataResult$hit, _kibanaDataResult$hit2, _kibanaDataResult$hit3;

  (0, _error_missing_required.checkParam)(kbnIndexPattern, 'kbnIndexPattern in cluster/findSupportedBasicLicenseCluster');
  serverLog(`Detected all clusters in monitoring data have basic license. Checking for supported admin cluster UUID for Kibana ${kibanaUuid}.`);
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const gte = req.payload.timeRange.min;
  const lte = req.payload.timeRange.max;
  const kibanaDataResult = await callWithRequest(req, 'search', {
    index: kbnIndexPattern,
    size: 1,
    ignoreUnavailable: true,
    filterPath: 'hits.hits._source.cluster_uuid',
    body: {
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: {
        bool: {
          filter: [{
            term: {
              type: 'kibana_stats'
            }
          }, {
            term: {
              'kibana_stats.kibana.uuid': kibanaUuid
            }
          }, {
            range: {
              timestamp: {
                gte,
                lte,
                format: 'strict_date_optional_time'
              }
            }
          }]
        }
      }
    }
  });
  const supportedClusterUuid = (_kibanaDataResult$hit = (_kibanaDataResult$hit2 = kibanaDataResult.hits) === null || _kibanaDataResult$hit2 === void 0 ? void 0 : (_kibanaDataResult$hit3 = _kibanaDataResult$hit2.hits[0]) === null || _kibanaDataResult$hit3 === void 0 ? void 0 : _kibanaDataResult$hit3._source.cluster_uuid) !== null && _kibanaDataResult$hit !== void 0 ? _kibanaDataResult$hit : undefined;

  for (const cluster of clusters) {
    if (cluster.cluster_uuid === supportedClusterUuid) {
      cluster.isSupported = true;
    }
  }

  serverLog(`Found basic license admin cluster UUID for Monitoring UI support: ${supportedClusterUuid}.`);
  return clusters;
}
/*
 * Flag clusters as supported, which means their monitoring data can be seen in the UI.
 *
 * Flagging a Basic licensed cluster as supported when it is part of a multi-cluster environment:
 * 1. Detect if there any standalone clusters and ignore those for these calculations as they are auto supported
 * 2. Detect if there are multiple linked clusters
 * 3. Detect if all of the different linked cluster licenses are basic
 * 4. Make a query to the monitored kibana data to find the "supported" linked cluster
 *    UUID, which is the linked cluster associated with *this* Kibana instance.
 * 5. Flag the linked cluster object with an `isSupported` boolean
 *
 * Non-Basic license clusters and any cluster in a single-cluster environment
 * are also flagged as supported in this method.
 */


function flagSupportedClusters(req, kbnIndexPattern) {
  (0, _error_missing_required.checkParam)(kbnIndexPattern, 'kbnIndexPattern in cluster/flagSupportedClusters');
  const config = req.server.config();

  const serverLog = message => req.getLogger('supported-clusters').debug(message);

  const flagAllSupported = clusters => {
    clusters.forEach(cluster => {
      if (cluster.license) {
        cluster.isSupported = true;
      }
    });
    return clusters;
  };

  return async function (clusters) {
    // Standalone clusters are automatically supported in the UI so ignore those for
    // our calculations here
    let linkedClusterCount = 0;

    for (const cluster of clusters) {
      if (cluster.cluster_uuid === _constants.STANDALONE_CLUSTER_CLUSTER_UUID) {
        cluster.isSupported = true;
      } else {
        linkedClusterCount++;
      }
    }

    if (linkedClusterCount > 1) {
      const basicLicenseCount = clusters.reduce((accumCount, cluster) => {
        if (cluster.license && cluster.license.type === 'basic') {
          accumCount++;
        }

        return accumCount;
      }, 0); // if all non-basic licenses

      if (basicLicenseCount === 0) {
        serverLog('Found all non-basic cluster licenses. All clusters will be supported.');
        return flagAllSupported(clusters);
      } // if all linked are basic licenses


      if (linkedClusterCount === basicLicenseCount) {
        const kibanaUuid = config.get('server.uuid');
        return await findSupportedBasicLicenseCluster(req, clusters, kbnIndexPattern, kibanaUuid, serverLog);
      } // if some non-basic licenses


      serverLog('Found some basic license clusters in monitoring data. Only non-basic will be supported.');
      clusters.forEach(cluster => {
        if (cluster.license && cluster.license.type !== 'basic') {
          cluster.isSupported = true;
        }
      });
      return clusters;
    } // not multi-cluster


    serverLog('Found single cluster in monitoring data.');
    return flagAllSupported(clusters);
  };
}
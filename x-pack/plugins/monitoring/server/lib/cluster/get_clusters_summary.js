"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClustersSummary = getClustersSummary;

var _lodash = require("lodash");

var _calculate_overall_status = require("../calculate_overall_status");

var _constants = require("../../../common/constants");

var _custom_errors = require("../errors/custom_errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getClustersSummary(server, clusters, kibanaUuid, isCcrEnabled) {
  return clusters.map(cluster => {
    const {
      isSupported,
      cluster_uuid: clusterUuid,
      version,
      license,
      cluster_stats: clusterStats,
      logstash,
      kibana,
      ml,
      beats,
      apm,
      alerts,
      ccs,
      cluster_settings: clusterSettings,
      logs
    } = cluster;
    const clusterName = (0, _lodash.get)(clusterSettings, 'cluster.metadata.display_name', cluster.cluster_name); // check for any missing licenses

    if (!license) {
      const clusterId = cluster.name || clusterName || clusterUuid;
      server.log(['error', _constants.LOGGING_TAG], "Could not find license information for cluster = '" + clusterId + "'. " + "Please check the cluster's master node server logs for errors or warnings.");
      throw new _custom_errors.MonitoringLicenseError(clusterId);
    }

    const {
      status: licenseStatus,
      type: licenseType,
      expiry_date_in_millis: licenseExpiry
    } = license;
    const indices = (0, _lodash.pick)(clusterStats.indices, ['count', 'docs', 'shards', 'store']);
    const jvm = {
      max_uptime_in_millis: clusterStats.nodes.jvm.max_uptime_in_millis,
      mem: clusterStats.nodes.jvm.mem
    };
    const nodes = {
      fs: clusterStats.nodes.fs,
      count: {
        total: clusterStats.nodes.count.total
      },
      jvm
    };
    const {
      status
    } = cluster.cluster_state;
    return {
      isSupported,
      cluster_uuid: clusterUuid,
      cluster_name: clusterName,
      version,
      license: {
        status: licenseStatus,
        type: licenseType,
        expiry_date_in_millis: licenseExpiry
      },
      elasticsearch: {
        cluster_stats: {
          indices,
          nodes,
          status
        },
        logs
      },
      logstash,
      kibana: (0, _lodash.omit)(kibana, 'uuids'),
      ml,
      ccs,
      beats,
      apm,
      alerts,
      isPrimary: kibana ? kibana.uuids.includes(kibanaUuid) : false,
      status: (0, _calculate_overall_status.calculateOverallStatus)([status, kibana && kibana.status || null]),
      isCcrEnabled
    };
  });
}
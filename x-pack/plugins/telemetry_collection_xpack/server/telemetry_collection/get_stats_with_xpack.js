"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatsWithXpack = void 0;

var _server = require("../../../../../src/plugins/telemetry/server");

var _get_xpack = require("./get_xpack");

var _get_license = require("./get_license");

var _is_cluster_opted_in = require("./is_cluster_opted_in");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getStatsWithXpack = async function (clustersDetails, config, context) {
  const {
    esClient
  } = config;
  const [clustersLocalStats, license, xpack] = await Promise.all([(0, _server.getLocalStats)(clustersDetails, config, context), (0, _get_license.getLicenseFromLocalOrMaster)(esClient), (0, _get_xpack.getXPackUsage)(esClient).catch(() => undefined) // We want to still report something (and do not lose the license) even when this method fails.
  ]);
  return clustersLocalStats.map(localStats => {
    const localStatsWithLicense = { ...localStats,
      ...(license && {
        license
      })
    };

    if (xpack) {
      return { ...localStatsWithLicense,
        stack_stats: { ...localStatsWithLicense.stack_stats,
          xpack
        }
      };
    }

    return localStatsWithLicense;
  }).reduce((acc, stats) => {
    var _stats$stack_stats$ki, _stats$stack_stats$ki2; // Concatenate the telemetry reported via monitoring as additional payloads instead of reporting it inside of stack_stats.kibana.plugins.monitoringTelemetry


    const monitoringTelemetry = (_stats$stack_stats$ki = stats.stack_stats.kibana) === null || _stats$stack_stats$ki === void 0 ? void 0 : (_stats$stack_stats$ki2 = _stats$stack_stats$ki.plugins) === null || _stats$stack_stats$ki2 === void 0 ? void 0 : _stats$stack_stats$ki2.monitoringTelemetry;

    if (monitoringTelemetry) {
      delete stats.stack_stats.kibana.plugins.monitoringTelemetry;
    } // From the monitoring-sourced telemetry, we need to filter out the clusters that are opted-out.


    const onlyOptedInMonitoringClusters = (monitoringTelemetry || []).filter(_is_cluster_opted_in.isClusterOptedIn);
    return [...acc, stats, ...onlyOptedInMonitoringClusters];
  }, []);
};

exports.getStatsWithXpack = getStatsWithXpack;
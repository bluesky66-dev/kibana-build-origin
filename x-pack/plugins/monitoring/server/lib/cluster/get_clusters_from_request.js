"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClustersFromRequest = getClustersFromRequest;

var _boom = require("@hapi/boom");

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _lodash = require("lodash");

var _get_clusters_stats = require("./get_clusters_stats");

var _flag_supported_clusters = require("./flag_supported_clusters");

var _elasticsearch = require("../elasticsearch");

var _kibana = require("../kibana");

var _logstash = require("../logstash");

var _get_pipeline_ids = require("../logstash/get_pipeline_ids");

var _beats = require("../beats");

var _get_clusters_summary = require("./get_clusters_summary");

var _constants = require("../../../common/constants");

var _get_apms_for_clusters = require("../apm/get_apms_for_clusters");

var _i18n = require("@kbn/i18n");

var _ccr = require("../elasticsearch/ccr");

var _fetch_status = require("../alerts/fetch_status");

var _standalone_clusters = require("../standalone_clusters");

var _logs = require("../logs");

var _is_in_code_path = require("./is_in_code_path");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Get all clusters or the cluster associated with {@code clusterUuid} when it is defined.
 */


async function getClustersFromRequest(req, indexPatterns, {
  clusterUuid,
  start,
  end,
  codePaths
} = {}) {
  const {
    esIndexPattern,
    kbnIndexPattern,
    lsIndexPattern,
    beatsIndexPattern,
    apmIndexPattern,
    filebeatIndexPattern
  } = indexPatterns;
  const config = req.server.config();
  const isStandaloneCluster = clusterUuid === _constants.STANDALONE_CLUSTER_CLUSTER_UUID;
  let clusters = [];

  if (isStandaloneCluster) {
    clusters.push((0, _standalone_clusters.getStandaloneClusterDefinition)());
  } else {
    // get clusters with stats and cluster state
    clusters = await (0, _get_clusters_stats.getClustersStats)(req, esIndexPattern, clusterUuid);
  }

  if (!clusterUuid && !isStandaloneCluster) {
    const indexPatternsToCheckForNonClusters = [lsIndexPattern, beatsIndexPattern, apmIndexPattern];

    if (await (0, _standalone_clusters.hasStandaloneClusters)(req, indexPatternsToCheckForNonClusters)) {
      clusters.push((0, _standalone_clusters.getStandaloneClusterDefinition)());
    }
  } // TODO: this handling logic should be two different functions


  if (clusterUuid) {
    // if is defined, get specific cluster (no need for license checking)
    if (!clusters || clusters.length === 0) {
      throw (0, _boom.notFound)(_i18n.i18n.translate('xpack.monitoring.requestedClusters.uuidNotFoundErrorMessage', {
        defaultMessage: 'Unable to find the cluster in the selected time range. UUID: {clusterUuid}',
        values: {
          clusterUuid
        }
      }));
    }

    const cluster = clusters[0]; // add ml jobs and alerts data

    const mlJobs = (0, _is_in_code_path.isInCodePath)(codePaths, [_constants.CODE_PATH_ML]) ? await (0, _elasticsearch.getMlJobsForCluster)(req, esIndexPattern, cluster) : null;

    if (mlJobs !== null) {
      cluster.ml = {
        jobs: mlJobs
      };
    }

    cluster.logs = (0, _is_in_code_path.isInCodePath)(codePaths, [_constants.CODE_PATH_LOGS]) ? await (0, _logs.getLogTypes)(req, filebeatIndexPattern, {
      clusterUuid: cluster.cluster_uuid,
      start,
      end
    }) : [];
  } else if (!isStandaloneCluster) {
    // get all clusters
    if (!clusters || clusters.length === 0) {
      // we do NOT throw 404 here so that the no-data page can use this to check for data
      // we should look at having a standalone function for that lookup
      return [];
    } // update clusters with license check results


    const getSupportedClusters = (0, _flag_supported_clusters.flagSupportedClusters)(req, kbnIndexPattern);
    clusters = await getSupportedClusters(clusters); // add alerts data

    if ((0, _is_in_code_path.isInCodePath)(codePaths, [_constants.CODE_PATH_ALERTS])) {
      const alertsClient = req.getAlertsClient();
      const alertStatus = await (0, _fetch_status.fetchStatus)(alertsClient, req.server.plugins.monitoring.info, undefined, clusters.map(cluster => cluster.cluster_uuid));

      for (const cluster of clusters) {
        if (!alertsClient) {
          cluster.alerts = {
            list: {},
            alertsMeta: {
              enabled: false
            }
          };
        } else {
          try {
            cluster.alerts = {
              list: Object.keys(alertStatus).reduce((accum, alertName) => {
                const value = alertStatus[alertName];

                if (value.states && value.states.length) {
                  accum[alertName] = { ...value,
                    states: value.states.filter(state => state.state.cluster.clusterUuid === cluster.cluster_uuid)
                  };
                } else {
                  accum[alertName] = value;
                }

                return accum;
              }, {}),
              alertsMeta: {
                enabled: true
              }
            };
          } catch (err) {
            req.logger.warn(`Unable to fetch alert status because '${err.message}'. Alerts may not properly show up in the UI.`);
            cluster.alerts = {
              list: {},
              alertsMeta: {
                enabled: true
              }
            };
          }
        }
      }
    }
  } // add kibana data


  const kibanas = (0, _is_in_code_path.isInCodePath)(codePaths, [_constants.CODE_PATH_KIBANA]) && !isStandaloneCluster ? await (0, _kibana.getKibanasForClusters)(req, kbnIndexPattern, clusters) : []; // add the kibana data to each cluster

  kibanas.forEach(kibana => {
    const clusterIndex = (0, _lodash.findIndex)(clusters, {
      cluster_uuid: kibana.clusterUuid
    });
    (0, _saferLodashSet.set)(clusters[clusterIndex], 'kibana', kibana.stats);
  }); // add logstash data

  if ((0, _is_in_code_path.isInCodePath)(codePaths, [_constants.CODE_PATH_LOGSTASH])) {
    const logstashes = await (0, _logstash.getLogstashForClusters)(req, lsIndexPattern, clusters);
    const pipelines = await (0, _get_pipeline_ids.getLogstashPipelineIds)(req, lsIndexPattern, {
      clusterUuid
    }, 1);
    logstashes.forEach(logstash => {
      const clusterIndex = (0, _lodash.findIndex)(clusters, {
        cluster_uuid: logstash.clusterUuid
      }); // withhold LS overview stats until there is at least 1 pipeline

      if (logstash.clusterUuid === clusterUuid && !pipelines.length) {
        logstash.stats = {};
      }

      (0, _saferLodashSet.set)(clusters[clusterIndex], 'logstash', logstash.stats);
    });
  } // add beats data


  const beatsByCluster = (0, _is_in_code_path.isInCodePath)(codePaths, [_constants.CODE_PATH_BEATS]) ? await (0, _beats.getBeatsForClusters)(req, beatsIndexPattern, clusters) : [];
  beatsByCluster.forEach(beats => {
    const clusterIndex = (0, _lodash.findIndex)(clusters, {
      cluster_uuid: beats.clusterUuid
    });
    (0, _saferLodashSet.set)(clusters[clusterIndex], 'beats', beats.stats);
  }); // add apm data

  const apmsByCluster = (0, _is_in_code_path.isInCodePath)(codePaths, [_constants.CODE_PATH_APM]) ? await (0, _get_apms_for_clusters.getApmsForClusters)(req, apmIndexPattern, clusters) : [];
  apmsByCluster.forEach(apm => {
    const clusterIndex = (0, _lodash.findIndex)(clusters, {
      cluster_uuid: apm.clusterUuid
    });
    (0, _saferLodashSet.set)(clusters[clusterIndex], 'apm', apm.stats);
  }); // check ccr configuration

  const isCcrEnabled = await (0, _ccr.checkCcrEnabled)(req, esIndexPattern);
  const kibanaUuid = config.get('server.uuid');
  return (0, _get_clusters_summary.getClustersSummary)(req.server, clusters, kibanaUuid, isCcrEnabled);
}
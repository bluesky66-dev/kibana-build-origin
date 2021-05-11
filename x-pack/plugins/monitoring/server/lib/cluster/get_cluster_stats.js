"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClusterStats = getClusterStats;

var _boom = require("@hapi/boom");

var _get_clusters_stats = require("./get_clusters_stats");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This will fetch the cluster stats and cluster state as a single object for the cluster specified by the {@code req}.
 *
 * @param {Object} req The incoming user's request
 * @param {String} esIndexPattern The Elasticsearch index pattern
 * @param {String} clusterUuid The requested cluster's UUID
 * @return {Promise} The object cluster response.
 */


function getClusterStats(req, esIndexPattern, clusterUuid) {
  if (!clusterUuid) {
    throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.monitoring.clusterStats.uuidNotSpecifiedErrorMessage', {
      defaultMessage: '{clusterUuid} not specified',
      values: {
        clusterUuid: 'clusterUuid'
      }
    }));
  } // passing clusterUuid so `get_clusters` will filter for single cluster


  return (0, _get_clusters_stats.getClustersStats)(req, esIndexPattern, clusterUuid).then(clusters => {
    if (!clusters || clusters.length === 0) {
      throw (0, _boom.notFound)(_i18n.i18n.translate('xpack.monitoring.clusterStats.uuidNotFoundErrorMessage', {
        defaultMessage: 'Unable to find the cluster in the selected time range. UUID: {clusterUuid}',
        values: {
          clusterUuid
        }
      }));
    }

    return clusters[0];
  });
}
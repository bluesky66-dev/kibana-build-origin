"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FOLLOWER_INDEX_ADVANCED_SETTINGS = exports.API_INDEX_MANAGEMENT_BASE_PATH = exports.API_REMOTE_CLUSTERS_BASE_PATH = exports.API_BASE_PATH = exports.BASE_PATH_REMOTE_CLUSTERS = exports.MANAGEMENT_ID = exports.APPS = exports.PLUGIN = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const platinumLicense = 'platinum';
const PLUGIN = {
  ID: 'crossClusterReplication',
  TITLE: _i18n.i18n.translate('xpack.crossClusterReplication.appTitle', {
    defaultMessage: 'Cross-Cluster Replication'
  }),
  minimumLicenseType: platinumLicense
};
exports.PLUGIN = PLUGIN;
const APPS = {
  CCR_APP: 'ccr',
  REMOTE_CLUSTER_APP: 'remote_cluster'
};
exports.APPS = APPS;
const MANAGEMENT_ID = 'cross_cluster_replication';
exports.MANAGEMENT_ID = MANAGEMENT_ID;
const BASE_PATH_REMOTE_CLUSTERS = 'data/remote_clusters';
exports.BASE_PATH_REMOTE_CLUSTERS = BASE_PATH_REMOTE_CLUSTERS;
const API_BASE_PATH = '/api/cross_cluster_replication';
exports.API_BASE_PATH = API_BASE_PATH;
const API_REMOTE_CLUSTERS_BASE_PATH = '/api/remote_clusters';
exports.API_REMOTE_CLUSTERS_BASE_PATH = API_REMOTE_CLUSTERS_BASE_PATH;
const API_INDEX_MANAGEMENT_BASE_PATH = '/api/index_management';
exports.API_INDEX_MANAGEMENT_BASE_PATH = API_INDEX_MANAGEMENT_BASE_PATH;
const FOLLOWER_INDEX_ADVANCED_SETTINGS = {
  maxReadRequestOperationCount: 5120,
  maxOutstandingReadRequests: 12,
  maxReadRequestSize: '32mb',
  maxWriteRequestOperationCount: 5120,
  maxWriteRequestSize: '9223372036854775807b',
  maxOutstandingWriteRequests: 9,
  maxWriteBufferCount: 2147483647,
  maxWriteBufferSize: '512mb',
  maxRetryDelay: '500ms',
  readPollTimeout: '1m'
};
exports.FOLLOWER_INDEX_ADVANCED_SETTINGS = FOLLOWER_INDEX_ADVANCED_SETTINGS;
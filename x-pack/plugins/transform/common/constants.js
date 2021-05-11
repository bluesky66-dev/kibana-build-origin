"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TRANSFORM_FUNCTION = exports.TRANSFORM_MODE = exports.TRANSFORM_STATE = exports.APP_INDEX_PRIVILEGES = exports.APP_CREATE_TRANSFORM_CLUSTER_PRIVILEGES = exports.APP_GET_TRANSFORM_CLUSTER_PRIVILEGES = exports.APP_CLUSTER_PRIVILEGES = exports.API_BASE_PATH = exports.PLUGIN = exports.PROGRESS_REFRESH_INTERVAL_MS = exports.MINIMUM_REFRESH_INTERVAL_MS = exports.DEFAULT_REFRESH_INTERVAL_MS = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEFAULT_REFRESH_INTERVAL_MS = 30000;
exports.DEFAULT_REFRESH_INTERVAL_MS = DEFAULT_REFRESH_INTERVAL_MS;
const MINIMUM_REFRESH_INTERVAL_MS = 1000;
exports.MINIMUM_REFRESH_INTERVAL_MS = MINIMUM_REFRESH_INTERVAL_MS;
const PROGRESS_REFRESH_INTERVAL_MS = 2000;
exports.PROGRESS_REFRESH_INTERVAL_MS = PROGRESS_REFRESH_INTERVAL_MS;
const PLUGIN = {
  ID: 'transform',
  MINIMUM_LICENSE_REQUIRED: 'basic',
  getI18nName: () => {
    return _i18n.i18n.translate('xpack.transform.appName', {
      defaultMessage: 'Transforms'
    });
  }
};
exports.PLUGIN = PLUGIN;
const API_BASE_PATH = '/api/transform/'; // In order to create a transform, the API requires the following privileges:
// - transform_admin (builtin)
//   - cluster privileges: manage_transform
//   - index privileges:
//     - indices: .transform-notifications-*, .data-frame-notifications-*, .transform-notifications-read
//     - privileges: view_index_metadata, read
// - transform_user (builtin)
//   - cluster privileges: monitor_transform
//   - index privileges:
//     - indices: .transform-notifications-*, .data-frame-notifications-*, .transform-notifications-read
//     - privileges: view_index_metadata, read
// - source index: read, view_index_metadata (can be applied to a pattern e.g. farequote-*)
// - dest index: index, create_index (can be applied to a pattern e.g. df-*)
//
// In the UI additional privileges are required:
// - kibana_admin (builtin)
// - dest index: monitor (applied to df-*)
// - cluster: monitor
//
// Note that users with kibana_admin can see all Kibana index patterns and saved searches
// in the source selection modal when creating a transform, but the wizard will trigger
// error callouts when there are no sufficient privileges to read the actual source indices.

exports.API_BASE_PATH = API_BASE_PATH;
const APP_CLUSTER_PRIVILEGES = ['cluster:monitor/transform/get', 'cluster:monitor/transform/stats/get', 'cluster:admin/transform/delete', 'cluster:admin/transform/preview', 'cluster:admin/transform/put', 'cluster:admin/transform/start', 'cluster:admin/transform/start_task', 'cluster:admin/transform/stop']; // Equivalent of capabilities.canGetTransform

exports.APP_CLUSTER_PRIVILEGES = APP_CLUSTER_PRIVILEGES;
const APP_GET_TRANSFORM_CLUSTER_PRIVILEGES = ['cluster.cluster:monitor/transform/get', 'cluster.cluster:monitor/transform/stats/get']; // Equivalent of capabilities.canGetTransform

exports.APP_GET_TRANSFORM_CLUSTER_PRIVILEGES = APP_GET_TRANSFORM_CLUSTER_PRIVILEGES;
const APP_CREATE_TRANSFORM_CLUSTER_PRIVILEGES = ['cluster.cluster:monitor/transform/get', 'cluster.cluster:monitor/transform/stats/get', 'cluster.cluster:admin/transform/preview', 'cluster.cluster:admin/transform/put', 'cluster.cluster:admin/transform/start', 'cluster.cluster:admin/transform/start_task'];
exports.APP_CREATE_TRANSFORM_CLUSTER_PRIVILEGES = APP_CREATE_TRANSFORM_CLUSTER_PRIVILEGES;
const APP_INDEX_PRIVILEGES = ['monitor']; // reflects https://github.com/elastic/elasticsearch/blob/master/x-pack/plugin/core/src/main/java/org/elasticsearch/xpack/core/dataframe/transforms/DataFrameTransformStats.java#L243

exports.APP_INDEX_PRIVILEGES = APP_INDEX_PRIVILEGES;
const TRANSFORM_STATE = {
  ABORTING: 'aborting',
  FAILED: 'failed',
  INDEXING: 'indexing',
  STARTED: 'started',
  STOPPED: 'stopped',
  STOPPING: 'stopping'
};
exports.TRANSFORM_STATE = TRANSFORM_STATE;
const transformStates = Object.values(TRANSFORM_STATE);
const TRANSFORM_MODE = {
  BATCH: 'batch',
  CONTINUOUS: 'continuous'
};
exports.TRANSFORM_MODE = TRANSFORM_MODE;
const transformModes = Object.values(TRANSFORM_MODE);
const TRANSFORM_FUNCTION = {
  PIVOT: 'pivot',
  LATEST: 'latest'
};
exports.TRANSFORM_FUNCTION = TRANSFORM_FUNCTION;
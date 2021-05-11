"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.APP_CLUSTER_REQUIRED_PRIVILEGES = exports.API_BASE_PATH = exports.PLUGIN_MIN_LICENSE_TYPE = exports.MANAGEMENT_APP_ID = exports.PLUGIN_ID = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const basicLicense = 'basic';
const PLUGIN_ID = 'ingest_pipelines';
exports.PLUGIN_ID = PLUGIN_ID;
const MANAGEMENT_APP_ID = 'management';
exports.MANAGEMENT_APP_ID = MANAGEMENT_APP_ID;
const PLUGIN_MIN_LICENSE_TYPE = basicLicense;
exports.PLUGIN_MIN_LICENSE_TYPE = PLUGIN_MIN_LICENSE_TYPE;
const API_BASE_PATH = '/api/ingest_pipelines';
exports.API_BASE_PATH = API_BASE_PATH;
const APP_CLUSTER_REQUIRED_PRIVILEGES = ['manage_pipeline', 'cluster:monitor/nodes/info'];
exports.APP_CLUSTER_REQUIRED_PRIVILEGES = APP_CLUSTER_REQUIRED_PRIVILEGES;
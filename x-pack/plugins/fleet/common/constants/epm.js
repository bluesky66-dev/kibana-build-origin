"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installationStatuses = exports.dataTypes = exports.agentAssetTypes = exports.defaultPackages = exports.requiredPackages = exports.FLEET_SERVER_PACKAGE = exports.MAX_TIME_COMPLETE_INSTALL = exports.INDEX_PATTERN_SAVED_OBJECT_TYPE = exports.ASSETS_SAVED_OBJECT_TYPE = exports.PACKAGES_SAVED_OBJECT_TYPE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PACKAGES_SAVED_OBJECT_TYPE = 'epm-packages';
exports.PACKAGES_SAVED_OBJECT_TYPE = PACKAGES_SAVED_OBJECT_TYPE;
const ASSETS_SAVED_OBJECT_TYPE = 'epm-packages-assets';
exports.ASSETS_SAVED_OBJECT_TYPE = ASSETS_SAVED_OBJECT_TYPE;
const INDEX_PATTERN_SAVED_OBJECT_TYPE = 'index-pattern';
exports.INDEX_PATTERN_SAVED_OBJECT_TYPE = INDEX_PATTERN_SAVED_OBJECT_TYPE;
const MAX_TIME_COMPLETE_INSTALL = 60000;
exports.MAX_TIME_COMPLETE_INSTALL = MAX_TIME_COMPLETE_INSTALL;
const FLEET_SERVER_PACKAGE = 'fleet_server';
exports.FLEET_SERVER_PACKAGE = FLEET_SERVER_PACKAGE;
const requiredPackages = {
  System: 'system',
  Endpoint: 'endpoint'
}; // these are currently identical. we can separate if they later diverge

exports.requiredPackages = requiredPackages;
const defaultPackages = requiredPackages;
exports.defaultPackages = defaultPackages;
const agentAssetTypes = {
  Input: 'input'
};
exports.agentAssetTypes = agentAssetTypes;
const dataTypes = {
  Logs: 'logs',
  Metrics: 'metrics'
};
exports.dataTypes = dataTypes;
const installationStatuses = {
  Installed: 'installed',
  NotInstalled: 'not_installed'
};
exports.installationStatuses = installationStatuses;
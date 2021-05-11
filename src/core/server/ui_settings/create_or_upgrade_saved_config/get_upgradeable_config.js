"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUpgradeableConfig = getUpgradeableConfig;

var _is_config_version_upgradeable = require("./is_config_version_upgradeable");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 *  Find the most recent SavedConfig that is upgradeable to the specified version
 *  @param {Object} options
 *  @property {SavedObjectsClient} savedObjectsClient
 *  @property {string} version
 *  @return {Promise<SavedConfig|undefined>}
 */
async function getUpgradeableConfig({
  savedObjectsClient,
  version
}) {
  // attempt to find a config we can upgrade
  const {
    saved_objects: savedConfigs
  } = await savedObjectsClient.find({
    type: 'config',
    page: 1,
    perPage: 1000,
    sortField: 'buildNum',
    sortOrder: 'desc'
  }); // try to find a config that we can upgrade

  return savedConfigs.find(savedConfig => (0, _is_config_version_upgradeable.isConfigVersionUpgradeable)(savedConfig.id, version));
}
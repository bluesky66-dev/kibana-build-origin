"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upgradeCheckProvider = upgradeCheckProvider;

var _log = require("../../lib/log");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function upgradeCheckProvider(mlClient) {
  async function isUpgradeInProgress() {
    let upgradeInProgress = false;

    try {
      const {
        body
      } = await mlClient.info(); // if ml indices are currently being migrated, upgrade_mode will be set to true
      // pass this back with the privileges to allow for the disabling of UI controls.

      upgradeInProgress = body.upgrade_mode === true;
    } catch (error) {
      // if the ml.info check fails, it could be due to the user having insufficient privileges
      // most likely they do not have the ml_user role and therefore will be blocked from using
      // ML at all. However, we need to catch this error so the privilege check doesn't fail.
      if (error.status === 403) {
        _log.mlLog.info('Unable to determine whether upgrade is being performed due to insufficient user privileges');
      } else {
        _log.mlLog.warn('Unable to determine whether upgrade is being performed');
      }
    }

    return upgradeInProgress;
  }

  return {
    isUpgradeInProgress
  };
}
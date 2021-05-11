"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultAdminEmail = getDefaultAdminEmail;
exports.checkForEmailValue = checkForEmailValue;
exports.getEmailValueStructure = getEmailValueStructure;
exports.getKibanaSettings = getKibanaSettings;
exports.getSettingsCollector = getSettingsCollector;

var _constants = require("../../../common/constants");

var _core_services = require("../../core_services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let loggedDeprecationWarning = false;
/*
 * Check if Cluster Alert email notifications is enabled in config
 * If so, use uiSettings API to fetch the X-Pack default admin email
 */

async function getDefaultAdminEmail(config, log) {
  const {
    email_notifications: {
      enabled,
      email_address: emailAddress
    }
  } = config.cluster_alerts;

  if (enabled && emailAddress !== null && emailAddress !== void 0 && emailAddress.length) {
    return emailAddress;
  }

  const defaultAdminEmail = await _core_services.CoreServices.getUISetting(_constants.XPACK_DEFAULT_ADMIN_EMAIL_UI_SETTING);

  if (defaultAdminEmail && !loggedDeprecationWarning && log) {
    const emailAddressConfigKey = `monitoring.${_constants.CLUSTER_ALERTS_ADDRESS_CONFIG_KEY}`;
    loggedDeprecationWarning = true;
    const message = `Monitoring is using "${_constants.XPACK_DEFAULT_ADMIN_EMAIL_UI_SETTING}" for cluster alert notifications, ` + `which will not be supported in Kibana 8.0. Please configure ${emailAddressConfigKey} in your kibana.yml settings`;
    log.warn(message);
  }

  return defaultAdminEmail;
} // we use shouldUseNull to determine if we need to send nulls; we only send nulls if the last email wasn't null


let shouldUseNull = true;

async function checkForEmailValue(config, _shouldUseNull = shouldUseNull, _getDefaultAdminEmail = getDefaultAdminEmail, log) {
  const defaultAdminEmail = await _getDefaultAdminEmail(config, log); // Allow null so clearing the advanced setting will be reflected in the data

  const isAcceptableNull = defaultAdminEmail === null && _shouldUseNull;
  /* NOTE we have no real validation checking here. If the user enters a bad
   * string for email, their email server will alert the admin the fact what
   * went wrong and they'll have to track it back to cluster alerts email
   * notifications on their own. */

  if (isAcceptableNull || defaultAdminEmail !== null) {
    return defaultAdminEmail;
  }
}

function getEmailValueStructure(email) {
  return {
    xpack: {
      default_admin_email: email
    }
  };
}

async function getKibanaSettings(logger, config) {
  let kibanaSettingsData;
  const defaultAdminEmail = await checkForEmailValue(config); // skip everything if defaultAdminEmail === undefined

  if (defaultAdminEmail || defaultAdminEmail === null && shouldUseNull) {
    kibanaSettingsData = getEmailValueStructure(defaultAdminEmail);
    logger.debug(`[${defaultAdminEmail}] default admin email setting found, sending [${_constants.KIBANA_SETTINGS_TYPE}] monitoring document.`);
  } else {
    logger.debug(`not sending [${_constants.KIBANA_SETTINGS_TYPE}] monitoring document because [${defaultAdminEmail}] is null or invalid.`);
  } // remember the current email so that we can mark it as successful if the bulk does not error out


  shouldUseNull = !!defaultAdminEmail; // returns undefined if there was no result

  return kibanaSettingsData;
}

function getSettingsCollector(usageCollection, config) {
  return usageCollection.makeStatsCollector({
    type: _constants.KIBANA_SETTINGS_TYPE,
    isReady: () => true,
    schema: {
      xpack: {
        default_admin_email: {
          type: 'text'
        }
      }
    },

    async fetch() {
      return getKibanaSettings(this.log, config);
    },

    getEmailValueStructure(email) {
      return getEmailValueStructure(email);
    }

  });
}
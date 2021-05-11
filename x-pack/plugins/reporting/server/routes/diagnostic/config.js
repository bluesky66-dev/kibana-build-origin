"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDiagnoseConfig = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _constants = require("../../../common/constants");

var _authorized_user_pre_routing = require("../lib/authorized_user_pre_routing");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const KIBANA_MAX_SIZE_BYTES_PATH = 'csv.maxSizeBytes';
const ES_MAX_SIZE_BYTES_PATH = 'http.max_content_length';

const numberToByteSizeValue = value => {
  if (typeof value === 'number') {
    return new _configSchema.ByteSizeValue(value);
  }

  return value;
};

const registerDiagnoseConfig = (reporting, logger) => {
  const setupDeps = reporting.getPluginSetupDeps();
  const userHandler = (0, _authorized_user_pre_routing.authorizedUserPreRoutingFactory)(reporting);
  const {
    router,
    elasticsearch
  } = setupDeps;
  router.post({
    path: `${_constants.API_DIAGNOSE_URL}/config`,
    validate: {}
  }, userHandler(async (user, context, req, res) => {
    const warnings = [];
    const {
      callAsInternalUser
    } = elasticsearch.legacy.client;
    const config = reporting.getConfig();
    const elasticClusterSettingsResponse = await callAsInternalUser('cluster.getSettings', {
      includeDefaults: true
    });
    const {
      persistent,
      transient,
      defaults: defaultSettings
    } = elasticClusterSettingsResponse;
    const elasticClusterSettings = (0, _lodash.defaults)({}, persistent, transient, defaultSettings);
    const elasticSearchMaxContent = (0, _lodash.get)(elasticClusterSettings, 'http.max_content_length', '100mb');

    const elasticSearchMaxContentBytes = _configSchema.ByteSizeValue.parse(elasticSearchMaxContent);

    const kibanaMaxContentBytes = numberToByteSizeValue(config.get('csv', 'maxSizeBytes'));

    if (kibanaMaxContentBytes.isGreaterThan(elasticSearchMaxContentBytes)) {
      const maxContentSizeWarning = _i18n.i18n.translate('xpack.reporting.diagnostic.configSizeMismatch', {
        defaultMessage: `xpack.reporting.{KIBANA_MAX_SIZE_BYTES_PATH} ({kibanaMaxContentBytes}) is higher than ElasticSearch's {ES_MAX_SIZE_BYTES_PATH} ({elasticSearchMaxContentBytes}). ` + `Please set {ES_MAX_SIZE_BYTES_PATH} in ElasticSearch to match, or lower your xpack.reporting.{KIBANA_MAX_SIZE_BYTES_PATH} in Kibana.`,
        values: {
          kibanaMaxContentBytes: kibanaMaxContentBytes.getValueInBytes(),
          elasticSearchMaxContentBytes: elasticSearchMaxContentBytes.getValueInBytes(),
          KIBANA_MAX_SIZE_BYTES_PATH,
          ES_MAX_SIZE_BYTES_PATH
        }
      });

      warnings.push(maxContentSizeWarning);
    }

    if (warnings.length) {
      warnings.forEach(warn => logger.warn(warn));
    }

    const body = {
      help: warnings,
      success: !warnings.length,
      logs: warnings.join('\n')
    };
    return res.ok({
      body
    });
  }));
};

exports.registerDiagnoseConfig = registerDiagnoseConfig;
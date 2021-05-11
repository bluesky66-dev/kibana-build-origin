"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deprecations = void 0;

var _lodash = require("lodash");

var _constants = require("../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Re-writes deprecated user-defined config settings and logs warnings as a
 * result of any rewrite operations.
 *
 * Important: Do not remove any deprecation warning until at least the next
 * major version!
 * @return {Array} array of rename operations and callback function for rename logging
 */


const deprecations = ({
  rename,
  renameFromRoot
}) => {
  return [// This order matters. The "blanket rename" needs to happen at the end
  renameFromRoot('xpack.monitoring.max_bucket_size', 'monitoring.ui.max_bucket_size'), renameFromRoot('xpack.monitoring.min_interval_seconds', 'monitoring.ui.min_interval_seconds'), renameFromRoot('xpack.monitoring.show_license_expiration', 'monitoring.ui.show_license_expiration'), renameFromRoot('xpack.monitoring.ui.container.elasticsearch.enabled', 'monitoring.ui.container.elasticsearch.enabled'), renameFromRoot('xpack.monitoring.ui.container.logstash.enabled', 'monitoring.ui.container.logstash.enabled'), renameFromRoot('xpack.monitoring.elasticsearch', 'monitoring.ui.elasticsearch'), renameFromRoot('xpack.monitoring.ccs.enabled', 'monitoring.ui.ccs.enabled'), renameFromRoot('xpack.monitoring.elasticsearch.logFetchCount', 'monitoring.ui.elasticsearch.logFetchCount'), renameFromRoot('xpack.monitoring', 'monitoring'), (config, fromPath, logger) => {
    const clusterAlertsEnabled = (0, _lodash.get)(config, 'monitoring.cluster_alerts.enabled', true);
    const emailNotificationsEnabled = clusterAlertsEnabled && (0, _lodash.get)(config, 'monitoring.cluster_alerts.email_notifications.enabled', true);
    const updatedKey = (0, _lodash.get)(config, `monitoring.${_constants.CLUSTER_ALERTS_ADDRESS_CONFIG_KEY}`);
    const legacyKey = (0, _lodash.get)(config, `xpack.monitoring.${_constants.CLUSTER_ALERTS_ADDRESS_CONFIG_KEY}`);

    if (emailNotificationsEnabled && !updatedKey && !legacyKey) {
      logger(`Config key [${fromPath}.${_constants.CLUSTER_ALERTS_ADDRESS_CONFIG_KEY}] will be required for email notifications to work in 8.0."`);
    }

    return config;
  }, (config, fromPath, logger) => {
    const es = (0, _lodash.get)(config, 'elasticsearch');

    if (es) {
      if (es.username === 'elastic') {
        logger(`Setting [${fromPath}.username] to "elastic" is deprecated. You should use the "kibana_system" user instead.`);
      } else if (es.username === 'kibana') {
        logger(`Setting [${fromPath}.username] to "kibana" is deprecated. You should use the "kibana_system" user instead.`);
      }
    }

    return config;
  }, (config, fromPath, logger) => {
    const ssl = (0, _lodash.get)(config, 'elasticsearch.ssl');

    if (ssl) {
      if (ssl.key !== undefined && ssl.certificate === undefined) {
        logger(`Setting [${fromPath}.key] without [${fromPath}.certificate] is deprecated. This has no effect, you should use both settings to enable TLS client authentication to Elasticsearch.`);
      } else if (ssl.certificate !== undefined && ssl.key === undefined) {
        logger(`Setting [${fromPath}.certificate] without [${fromPath}.key] is deprecated. This has no effect, you should use both settings to enable TLS client authentication to Elasticsearch.`);
      }
    }

    return config;
  }, rename('xpack_api_polling_frequency_millis', 'licensing.api_polling_frequency')];
};

exports.deprecations = deprecations;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.envoyproxyMetricsSpecProvider = envoyproxyMetricsSpecProvider;

var _i18n = require("@kbn/i18n");

var _tutorials = require("../../services/tutorials");

var _metricbeat_instructions = require("../instructions/metricbeat_instructions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function envoyproxyMetricsSpecProvider(context) {
  const moduleName = 'envoyproxy';
  return {
    id: 'envoyproxyMetrics',
    name: _i18n.i18n.translate('home.tutorials.envoyproxyMetrics.nameTitle', {
      defaultMessage: 'Envoy Proxy metrics'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.METRICS,
    shortDescription: _i18n.i18n.translate('home.tutorials.envoyproxyMetrics.shortDescription', {
      defaultMessage: 'Fetch monitoring metrics from Envoy Proxy.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.envoyproxyMetrics.longDescription', {
      defaultMessage: 'The `envoyproxy` Metricbeat module fetches monitoring metrics from Envoy Proxy. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-envoyproxy.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/envoyproxy.svg',
    artifacts: {
      dashboards: [],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-envoyproxy.html'
      }
    },
    completionTimeMinutes: 10,
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName)
  };
}
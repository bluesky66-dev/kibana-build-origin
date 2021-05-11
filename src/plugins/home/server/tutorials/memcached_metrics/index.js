"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.memcachedMetricsSpecProvider = memcachedMetricsSpecProvider;

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
function memcachedMetricsSpecProvider(context) {
  const moduleName = 'memcached';
  return {
    id: 'memcachedMetrics',
    name: _i18n.i18n.translate('home.tutorials.memcachedMetrics.nameTitle', {
      defaultMessage: 'Memcached metrics'
    }),
    moduleName,
    isBeta: false,
    category: _tutorials.TutorialsCategory.METRICS,
    shortDescription: _i18n.i18n.translate('home.tutorials.memcachedMetrics.shortDescription', {
      defaultMessage: 'Fetch internal metrics from the Memcached server.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.memcachedMetrics.longDescription', {
      defaultMessage: 'The `memcached` Metricbeat module fetches internal metrics from Memcached. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-memcached.html'
      }
    }),
    euiIconType: 'logoMemcached',
    artifacts: {
      application: {
        label: _i18n.i18n.translate('home.tutorials.memcachedMetrics.artifacts.application.label', {
          defaultMessage: 'Discover'
        }),
        path: '/app/discover#/'
      },
      dashboards: [],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-memcached.html'
      }
    },
    completionTimeMinutes: 10,
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName)
  };
}
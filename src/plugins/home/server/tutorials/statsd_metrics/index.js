"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statsdMetricsSpecProvider = statsdMetricsSpecProvider;

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
function statsdMetricsSpecProvider(context) {
  const moduleName = 'statsd';
  return {
    id: 'statsdMetrics',
    name: _i18n.i18n.translate('home.tutorials.statsdMetrics.nameTitle', {
      defaultMessage: 'Statsd metrics'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.METRICS,
    shortDescription: _i18n.i18n.translate('home.tutorials.statsdMetrics.shortDescription', {
      defaultMessage: 'Fetch monitoring metrics from statsd.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.statsdMetrics.longDescription', {
      defaultMessage: 'The `statsd` Metricbeat module fetches monitoring metrics from statsd. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-statsd.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/statsd.svg',
    artifacts: {
      dashboards: [],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-statsd.html'
      }
    },
    completionTimeMinutes: 10,
    // previewImagePath: '',
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName)
  };
}
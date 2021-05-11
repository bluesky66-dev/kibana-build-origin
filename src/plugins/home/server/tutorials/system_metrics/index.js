"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.systemMetricsSpecProvider = systemMetricsSpecProvider;

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
function systemMetricsSpecProvider(context) {
  const moduleName = 'system';
  return {
    id: 'systemMetrics',
    name: _i18n.i18n.translate('home.tutorials.systemMetrics.nameTitle', {
      defaultMessage: 'System metrics'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.METRICS,
    shortDescription: _i18n.i18n.translate('home.tutorials.systemMetrics.shortDescription', {
      defaultMessage: 'Collect CPU, memory, network, and disk statistics from the host.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.systemMetrics.longDescription', {
      defaultMessage: 'The `system` Metricbeat module collects CPU, memory, network, and disk statistics from the host. \
It collects system wide statistics and statistics per process and filesystem. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-system.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/system.svg',
    artifacts: {
      dashboards: [{
        id: 'Metricbeat-system-overview-ecs',
        linkLabel: _i18n.i18n.translate('home.tutorials.systemMetrics.artifacts.dashboards.linkLabel', {
          defaultMessage: 'System metrics dashboard'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-system.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/system_metrics/screenshot.png',
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName)
  };
}
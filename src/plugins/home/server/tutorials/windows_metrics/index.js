"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.windowsMetricsSpecProvider = windowsMetricsSpecProvider;

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
function windowsMetricsSpecProvider(context) {
  const moduleName = 'windows';
  return {
    id: 'windowsMetrics',
    name: _i18n.i18n.translate('home.tutorials.windowsMetrics.nameTitle', {
      defaultMessage: 'Windows metrics'
    }),
    moduleName,
    isBeta: false,
    category: _tutorials.TutorialsCategory.METRICS,
    shortDescription: _i18n.i18n.translate('home.tutorials.windowsMetrics.shortDescription', {
      defaultMessage: 'Fetch internal metrics from Windows.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.windowsMetrics.longDescription', {
      defaultMessage: 'The `windows` Metricbeat module fetches internal metrics from Windows. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-windows.html'
      }
    }),
    euiIconType: 'logoWindows',
    artifacts: {
      application: {
        label: _i18n.i18n.translate('home.tutorials.windowsMetrics.artifacts.application.label', {
          defaultMessage: 'Discover'
        }),
        path: '/app/discover#/'
      },
      dashboards: [],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-windows.html'
      }
    },
    completionTimeMinutes: 10,
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName)
  };
}
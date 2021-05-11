"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropwizardMetricsSpecProvider = dropwizardMetricsSpecProvider;

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
function dropwizardMetricsSpecProvider(context) {
  const moduleName = 'dropwizard';
  return {
    id: 'dropwizardMetrics',
    name: _i18n.i18n.translate('home.tutorials.dropwizardMetrics.nameTitle', {
      defaultMessage: 'Dropwizard metrics'
    }),
    moduleName,
    isBeta: false,
    category: _tutorials.TutorialsCategory.METRICS,
    shortDescription: _i18n.i18n.translate('home.tutorials.dropwizardMetrics.shortDescription', {
      defaultMessage: 'Fetch internal metrics from Dropwizard Java application.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.dropwizardMetrics.longDescription', {
      defaultMessage: 'The `dropwizard` Metricbeat module fetches internal metrics from Dropwizard Java Application. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-dropwizard.html'
      }
    }),
    euiIconType: 'logoDropwizard',
    artifacts: {
      application: {
        label: _i18n.i18n.translate('home.tutorials.dropwizardMetrics.artifacts.application.label', {
          defaultMessage: 'Discover'
        }),
        path: '/app/discover#/'
      },
      dashboards: [],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-dropwizard.html'
      }
    },
    completionTimeMinutes: 10,
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName)
  };
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gcpMetricsSpecProvider = gcpMetricsSpecProvider;

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
function gcpMetricsSpecProvider(context) {
  const moduleName = 'gcp';
  return {
    id: 'gcpMetrics',
    name: _i18n.i18n.translate('home.tutorials.gcpMetrics.nameTitle', {
      defaultMessage: 'Google Cloud metrics'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.METRICS,
    shortDescription: _i18n.i18n.translate('home.tutorials.gcpMetrics.shortDescription', {
      defaultMessage: 'Fetch monitoring metrics from Google Cloud Platform using Stackdriver Monitoring API.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.gcpMetrics.longDescription', {
      defaultMessage: 'The `gcp` Metricbeat module fetches monitoring metrics from Google Cloud Platform using Stackdriver Monitoring API. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-gcp.html'
      }
    }),
    euiIconType: 'logoGCP',
    isBeta: false,
    artifacts: {
      dashboards: [{
        id: 'f40ee870-5e4a-11ea-a4f6-717338406083',
        linkLabel: _i18n.i18n.translate('home.tutorials.gcpMetrics.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Google Cloud metrics dashboard'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-gcp.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/gcp_metrics/screenshot.png',
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName)
  };
}
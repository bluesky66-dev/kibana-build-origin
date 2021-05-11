"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cockroachdbMetricsSpecProvider = cockroachdbMetricsSpecProvider;

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
function cockroachdbMetricsSpecProvider(context) {
  const moduleName = 'cockroachdb';
  return {
    id: 'cockroachdbMetrics',
    name: _i18n.i18n.translate('home.tutorials.cockroachdbMetrics.nameTitle', {
      defaultMessage: 'CockroachDB metrics'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.METRICS,
    shortDescription: _i18n.i18n.translate('home.tutorials.cockroachdbMetrics.shortDescription', {
      defaultMessage: 'Fetch monitoring metrics from the CockroachDB server.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.cockroachdbMetrics.longDescription', {
      defaultMessage: 'The `cockroachdb` Metricbeat module fetches monitoring metrics from CockroachDB. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-cockroachdb.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/cockroachdb.svg',
    artifacts: {
      dashboards: [{
        id: 'e3ba0c30-9766-11e9-9eea-6f554992ec1f',
        linkLabel: _i18n.i18n.translate('home.tutorials.cockroachdbMetrics.artifacts.dashboards.linkLabel', {
          defaultMessage: 'CockroachDB metrics dashboard'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-cockroachdb.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/cockroachdb_metrics/screenshot.png',
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName)
  };
}
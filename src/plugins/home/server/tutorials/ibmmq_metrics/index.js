"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ibmmqMetricsSpecProvider = ibmmqMetricsSpecProvider;

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
function ibmmqMetricsSpecProvider(context) {
  const moduleName = 'ibmmq';
  return {
    id: 'ibmmqMetrics',
    name: _i18n.i18n.translate('home.tutorials.ibmmqMetrics.nameTitle', {
      defaultMessage: 'IBM MQ metrics'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.METRICS,
    shortDescription: _i18n.i18n.translate('home.tutorials.ibmmqMetrics.shortDescription', {
      defaultMessage: 'Fetch monitoring metrics from IBM MQ instances.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.ibmmqMetrics.longDescription', {
      defaultMessage: 'The `ibmmq` Metricbeat module fetches monitoring metrics from IBM MQ instances \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-ibmmq.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/ibmmq.svg',
    isBeta: true,
    artifacts: {
      application: {
        label: _i18n.i18n.translate('home.tutorials.ibmmqMetrics.artifacts.application.label', {
          defaultMessage: 'Discover'
        }),
        path: '/app/discover#/'
      },
      dashboards: [],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-ibmmq.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/ibmmq_metrics/screenshot.png',
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName)
  };
}
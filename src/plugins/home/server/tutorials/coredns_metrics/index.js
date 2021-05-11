"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.corednsMetricsSpecProvider = corednsMetricsSpecProvider;

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
function corednsMetricsSpecProvider(context) {
  const moduleName = 'coredns';
  return {
    id: 'corednsMetrics',
    name: _i18n.i18n.translate('home.tutorials.corednsMetrics.nameTitle', {
      defaultMessage: 'CoreDNS metrics'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.METRICS,
    shortDescription: _i18n.i18n.translate('home.tutorials.corednsMetrics.shortDescription', {
      defaultMessage: 'Fetch monitoring metrics from the CoreDNS server.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.corednsMetrics.longDescription', {
      defaultMessage: 'The `coredns` Metricbeat module fetches monitoring metrics from CoreDNS. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-coredns.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/coredns.svg',
    artifacts: {
      application: {
        label: _i18n.i18n.translate('home.tutorials.corednsMetrics.artifacts.application.label', {
          defaultMessage: 'Discover'
        }),
        path: '/app/discover#/'
      },
      dashboards: [],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-coredns.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/coredns_metrics/screenshot.png',
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName)
  };
}
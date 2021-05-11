"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consulMetricsSpecProvider = consulMetricsSpecProvider;

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
function consulMetricsSpecProvider(context) {
  const moduleName = 'consul';
  return {
    id: 'consulMetrics',
    name: _i18n.i18n.translate('home.tutorials.consulMetrics.nameTitle', {
      defaultMessage: 'Consul metrics'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.METRICS,
    shortDescription: _i18n.i18n.translate('home.tutorials.consulMetrics.shortDescription', {
      defaultMessage: 'Fetch monitoring metrics from the Consul server.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.consulMetrics.longDescription', {
      defaultMessage: 'The `consul` Metricbeat module fetches monitoring metrics from Consul. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-consul.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/consul.svg',
    artifacts: {
      dashboards: [{
        id: '496910f0-b952-11e9-a579-f5c0a5d81340',
        linkLabel: _i18n.i18n.translate('home.tutorials.consulMetrics.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Consul metrics dashboard'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-consul.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/consul_metrics/screenshot.png',
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName)
  };
}
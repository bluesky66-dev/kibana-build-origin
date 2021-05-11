"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kafkaMetricsSpecProvider = kafkaMetricsSpecProvider;

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
function kafkaMetricsSpecProvider(context) {
  const moduleName = 'kafka';
  return {
    id: 'kafkaMetrics',
    name: _i18n.i18n.translate('home.tutorials.kafkaMetrics.nameTitle', {
      defaultMessage: 'Kafka metrics'
    }),
    moduleName,
    isBeta: false,
    category: _tutorials.TutorialsCategory.METRICS,
    shortDescription: _i18n.i18n.translate('home.tutorials.kafkaMetrics.shortDescription', {
      defaultMessage: 'Fetch internal metrics from the Kafka server.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.kafkaMetrics.longDescription', {
      defaultMessage: 'The `kafka` Metricbeat module fetches internal metrics from Kafka. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-kafka.html'
      }
    }),
    euiIconType: 'logoKafka',
    artifacts: {
      application: {
        label: _i18n.i18n.translate('home.tutorials.kafkaMetrics.artifacts.application.label', {
          defaultMessage: 'Discover'
        }),
        path: '/app/discover#/'
      },
      dashboards: [],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-kafka.html'
      }
    },
    completionTimeMinutes: 10,
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName)
  };
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awsMetricsSpecProvider = awsMetricsSpecProvider;

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
function awsMetricsSpecProvider(context) {
  const moduleName = 'aws';
  return {
    id: 'awsMetrics',
    name: _i18n.i18n.translate('home.tutorials.awsMetrics.nameTitle', {
      defaultMessage: 'AWS metrics'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.METRICS,
    shortDescription: _i18n.i18n.translate('home.tutorials.awsMetrics.shortDescription', {
      defaultMessage: 'Fetch monitoring metrics for EC2 instances from the AWS APIs and Cloudwatch.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.awsMetrics.longDescription', {
      defaultMessage: 'The `aws` Metricbeat module fetches monitoring metrics from the AWS APIs and Cloudwatch. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-aws.html'
      }
    }),
    euiIconType: 'logoAWS',
    isBeta: false,
    artifacts: {
      dashboards: [{
        id: 'c5846400-f7fb-11e8-af03-c999c9dea608-ecs',
        linkLabel: _i18n.i18n.translate('home.tutorials.awsMetrics.artifacts.dashboards.linkLabel', {
          defaultMessage: 'AWS metrics dashboard'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-aws.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/aws_metrics/screenshot.png',
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName)
  };
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloudwatchLogsSpecProvider = cloudwatchLogsSpecProvider;

var _i18n = require("@kbn/i18n");

var _tutorials = require("../../services/tutorials");

var _functionbeat_instructions = require("../instructions/functionbeat_instructions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function cloudwatchLogsSpecProvider(context) {
  const moduleName = 'aws';
  return {
    id: 'cloudwatchLogs',
    name: _i18n.i18n.translate('home.tutorials.cloudwatchLogs.nameTitle', {
      defaultMessage: 'AWS Cloudwatch logs'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.LOGGING,
    shortDescription: _i18n.i18n.translate('home.tutorials.cloudwatchLogs.shortDescription', {
      defaultMessage: 'Collect Cloudwatch logs with Functionbeat.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.cloudwatchLogs.longDescription', {
      defaultMessage: 'Collect Cloudwatch logs by deploying Functionbeat to run as \
        an AWS Lambda function. \
        [Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.functionbeat}/functionbeat-installation-configuration.html'
      }
    }),
    euiIconType: 'logoAWS',
    artifacts: {
      dashboards: [// TODO
      ],
      exportedFields: {
        documentationUrl: '{config.docs.beats.functionbeat}/exported-fields.html'
      }
    },
    completionTimeMinutes: 10,
    onPrem: (0, _functionbeat_instructions.onPremInstructions)([], context),
    elasticCloud: (0, _functionbeat_instructions.cloudInstructions)(),
    onPremElasticCloud: (0, _functionbeat_instructions.onPremCloudInstructions)()
  };
}
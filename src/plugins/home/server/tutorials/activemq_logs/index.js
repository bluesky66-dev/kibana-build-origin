"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activemqLogsSpecProvider = activemqLogsSpecProvider;

var _i18n = require("@kbn/i18n");

var _tutorials = require("../../services/tutorials");

var _filebeat_instructions = require("../instructions/filebeat_instructions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function activemqLogsSpecProvider(context) {
  const moduleName = 'activemq';
  const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
  return {
    id: 'activemqLogs',
    name: _i18n.i18n.translate('home.tutorials.activemqLogs.nameTitle', {
      defaultMessage: 'ActiveMQ logs'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.LOGGING,
    shortDescription: _i18n.i18n.translate('home.tutorials.activemqLogs.shortDescription', {
      defaultMessage: 'Collect ActiveMQ logs with Filebeat.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.activemqLogs.longDescription', {
      defaultMessage: 'Collect ActiveMQ logs with Filebeat. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-activemq.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/activemq.svg',
    artifacts: {
      dashboards: [{
        id: 'ffe86390-145f-11ea-8fd8-030a13064883',
        linkLabel: _i18n.i18n.translate('home.tutorials.activemqLogs.artifacts.dashboards.linkLabel', {
          defaultMessage: 'ActiveMQ Audit Events'
        }),
        isOverview: false
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-activemq.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/activemq_logs/screenshot.png',
    onPrem: (0, _filebeat_instructions.onPremInstructions)(moduleName, platforms, context),
    elasticCloud: (0, _filebeat_instructions.cloudInstructions)(moduleName, platforms),
    onPremElasticCloud: (0, _filebeat_instructions.onPremCloudInstructions)(moduleName, platforms)
  };
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkpointLogsSpecProvider = checkpointLogsSpecProvider;

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
function checkpointLogsSpecProvider(context) {
  const moduleName = 'checkpoint';
  const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
  return {
    id: 'checkpointLogs',
    name: _i18n.i18n.translate('home.tutorials.checkpointLogs.nameTitle', {
      defaultMessage: 'Check Point logs'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.SECURITY_SOLUTION,
    shortDescription: _i18n.i18n.translate('home.tutorials.checkpointLogs.shortDescription', {
      defaultMessage: 'Collect Check Point firewall logs.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.checkpointLogs.longDescription', {
      defaultMessage: 'This is a module for Check Point firewall logs. It supports logs from the Log Exporter in the Syslog format. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-checkpoint.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/checkpoint.svg',
    artifacts: {
      dashboards: [],
      application: {
        path: '/app/security',
        label: _i18n.i18n.translate('home.tutorials.checkpointLogs.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Security App'
        })
      },
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-checkpoint.html'
      }
    },
    completionTimeMinutes: 10,
    onPrem: (0, _filebeat_instructions.onPremInstructions)(moduleName, platforms, context),
    elasticCloud: (0, _filebeat_instructions.cloudInstructions)(moduleName, platforms),
    onPremElasticCloud: (0, _filebeat_instructions.onPremCloudInstructions)(moduleName, platforms)
  };
}
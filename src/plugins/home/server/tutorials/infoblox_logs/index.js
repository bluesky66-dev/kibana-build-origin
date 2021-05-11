"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.infobloxLogsSpecProvider = infobloxLogsSpecProvider;

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
function infobloxLogsSpecProvider(context) {
  const moduleName = 'infoblox';
  const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
  return {
    id: 'infobloxLogs',
    name: _i18n.i18n.translate('home.tutorials.infobloxLogs.nameTitle', {
      defaultMessage: 'Infoblox logs'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.SECURITY_SOLUTION,
    shortDescription: _i18n.i18n.translate('home.tutorials.infobloxLogs.shortDescription', {
      defaultMessage: 'Collect Infoblox NIOS logs over syslog or from a file.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.infobloxLogs.longDescription', {
      defaultMessage: 'This is a module for receiving Infoblox NIOS logs over Syslog or a file. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-infoblox.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/infoblox.svg',
    artifacts: {
      dashboards: [],
      application: {
        path: '/app/security',
        label: _i18n.i18n.translate('home.tutorials.infobloxLogs.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Security App'
        })
      },
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-infoblox.html'
      }
    },
    completionTimeMinutes: 10,
    onPrem: (0, _filebeat_instructions.onPremInstructions)(moduleName, platforms, context),
    elasticCloud: (0, _filebeat_instructions.cloudInstructions)(moduleName, platforms),
    onPremElasticCloud: (0, _filebeat_instructions.onPremCloudInstructions)(moduleName, platforms)
  };
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.barracudaLogsSpecProvider = barracudaLogsSpecProvider;

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
function barracudaLogsSpecProvider(context) {
  const moduleName = 'barracuda';
  const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
  return {
    id: 'barracudaLogs',
    name: _i18n.i18n.translate('home.tutorials.barracudaLogs.nameTitle', {
      defaultMessage: 'Barracuda logs'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.SECURITY_SOLUTION,
    shortDescription: _i18n.i18n.translate('home.tutorials.barracudaLogs.shortDescription', {
      defaultMessage: 'Collect Barracuda Web Application Firewall logs over syslog or from a file.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.barracudaLogs.longDescription', {
      defaultMessage: 'This is a module for receiving Barracuda Web Application Firewall logs over Syslog or a file. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-barracuda.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/barracuda.svg',
    artifacts: {
      dashboards: [],
      application: {
        path: '/app/security',
        label: _i18n.i18n.translate('home.tutorials.barracudaLogs.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Security App'
        })
      },
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-barracuda.html'
      }
    },
    completionTimeMinutes: 10,
    onPrem: (0, _filebeat_instructions.onPremInstructions)(moduleName, platforms, context),
    elasticCloud: (0, _filebeat_instructions.cloudInstructions)(moduleName, platforms),
    onPremElasticCloud: (0, _filebeat_instructions.onPremCloudInstructions)(moduleName, platforms)
  };
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fortinetLogsSpecProvider = fortinetLogsSpecProvider;

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
function fortinetLogsSpecProvider(context) {
  const moduleName = 'fortinet';
  const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
  return {
    id: 'fortinetLogs',
    name: _i18n.i18n.translate('home.tutorials.fortinetLogs.nameTitle', {
      defaultMessage: 'Fortinet logs'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.SECURITY_SOLUTION,
    shortDescription: _i18n.i18n.translate('home.tutorials.fortinetLogs.shortDescription', {
      defaultMessage: 'Collect Fortinet FortiOS logs over syslog.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.fortinetLogs.longDescription', {
      defaultMessage: 'This is a module for Fortinet FortiOS logs sent in the syslog format. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-fortinet.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/fortinet.svg',
    artifacts: {
      dashboards: [],
      application: {
        path: '/app/security',
        label: _i18n.i18n.translate('home.tutorials.fortinetLogs.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Security App'
        })
      },
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-fortinet.html'
      }
    },
    completionTimeMinutes: 10,
    onPrem: (0, _filebeat_instructions.onPremInstructions)(moduleName, platforms, context),
    elasticCloud: (0, _filebeat_instructions.cloudInstructions)(moduleName, platforms),
    onPremElasticCloud: (0, _filebeat_instructions.onPremCloudInstructions)(moduleName, platforms)
  };
}
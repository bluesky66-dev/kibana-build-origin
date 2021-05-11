"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.windowsEventLogsSpecProvider = windowsEventLogsSpecProvider;

var _i18n = require("@kbn/i18n");

var _tutorials = require("../../services/tutorials");

var _winlogbeat_instructions = require("../instructions/winlogbeat_instructions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function windowsEventLogsSpecProvider(context) {
  const moduleName = 'windows';
  return {
    id: 'windowsEventLogs',
    name: _i18n.i18n.translate('home.tutorials.windowsEventLogs.nameTitle', {
      defaultMessage: 'Windows Event Log'
    }),
    moduleName,
    isBeta: false,
    category: _tutorials.TutorialsCategory.SECURITY_SOLUTION,
    shortDescription: _i18n.i18n.translate('home.tutorials.windowsEventLogs.shortDescription', {
      defaultMessage: 'Fetch logs from the Windows Event Log.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.windowsEventLogs.longDescription', {
      defaultMessage: 'Use Winlogbeat to collect the logs from the Windows Event Log. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.winlogbeat}/index.html'
      }
    }),
    euiIconType: 'logoWindows',
    artifacts: {
      application: {
        label: _i18n.i18n.translate('home.tutorials.windowsEventLogs.artifacts.application.label', {
          defaultMessage: 'SIEM App'
        }),
        path: '/app/siem'
      },
      dashboards: [],
      exportedFields: {
        documentationUrl: '{config.docs.beats.winlogbeat}/exported-fields.html'
      }
    },
    completionTimeMinutes: 10,
    onPrem: (0, _winlogbeat_instructions.onPremInstructions)(context),
    elasticCloud: (0, _winlogbeat_instructions.cloudInstructions)(),
    onPremElasticCloud: (0, _winlogbeat_instructions.onPremCloudInstructions)()
  };
}
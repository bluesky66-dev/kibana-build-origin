"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kibanaLogsSpecProvider = kibanaLogsSpecProvider;

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
function kibanaLogsSpecProvider(context) {
  const moduleName = 'kibana';
  const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
  return {
    id: 'kibanaLogs',
    name: _i18n.i18n.translate('home.tutorials.kibanaLogs.nameTitle', {
      defaultMessage: 'Kibana Logs'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.LOGGING,
    shortDescription: _i18n.i18n.translate('home.tutorials.kibanaLogs.shortDescription', {
      defaultMessage: 'Collect Kibana logs.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.kibanaLogs.longDescription', {
      defaultMessage: 'This is the Kibana module. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-kibana.html'
      }
    }),
    euiIconType: 'logoKibana',
    artifacts: {
      dashboards: [],
      application: {
        label: _i18n.i18n.translate('home.tutorials.kibanaLogs.artifacts.application.label', {
          defaultMessage: 'Discover'
        }),
        path: '/app/discover#/'
      },
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-kibana.html'
      }
    },
    completionTimeMinutes: 10,
    onPrem: (0, _filebeat_instructions.onPremInstructions)(moduleName, platforms, context),
    elasticCloud: (0, _filebeat_instructions.cloudInstructions)(moduleName, platforms),
    onPremElasticCloud: (0, _filebeat_instructions.onPremCloudInstructions)(moduleName, platforms)
  };
}
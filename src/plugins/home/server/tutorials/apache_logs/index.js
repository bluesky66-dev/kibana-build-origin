"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apacheLogsSpecProvider = apacheLogsSpecProvider;

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
function apacheLogsSpecProvider(context) {
  const moduleName = 'apache';
  const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
  return {
    id: 'apacheLogs',
    name: _i18n.i18n.translate('home.tutorials.apacheLogs.nameTitle', {
      defaultMessage: 'Apache logs'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.LOGGING,
    shortDescription: _i18n.i18n.translate('home.tutorials.apacheLogs.shortDescription', {
      defaultMessage: 'Collect and parse access and error logs created by the Apache HTTP server.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.apacheLogs.longDescription', {
      defaultMessage: 'The apache Filebeat module parses access and error logs created by the Apache HTTP server. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-apache.html'
      }
    }),
    euiIconType: 'logoApache',
    artifacts: {
      dashboards: [{
        id: 'Filebeat-Apache-Dashboard-ecs',
        linkLabel: _i18n.i18n.translate('home.tutorials.apacheLogs.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Apache logs dashboard'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-apache.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/apache_logs/screenshot.png',
    onPrem: (0, _filebeat_instructions.onPremInstructions)(moduleName, platforms, context),
    elasticCloud: (0, _filebeat_instructions.cloudInstructions)(moduleName, platforms),
    onPremElasticCloud: (0, _filebeat_instructions.onPremCloudInstructions)(moduleName, platforms)
  };
}
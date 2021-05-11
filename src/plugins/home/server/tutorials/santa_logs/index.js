"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.santaLogsSpecProvider = santaLogsSpecProvider;

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
function santaLogsSpecProvider(context) {
  const moduleName = 'santa';
  const platforms = ['OSX'];
  return {
    id: 'santaLogs',
    name: _i18n.i18n.translate('home.tutorials.santaLogs.nameTitle', {
      defaultMessage: 'Google Santa logs'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.SECURITY_SOLUTION,
    shortDescription: _i18n.i18n.translate('home.tutorials.santaLogs.shortDescription', {
      defaultMessage: 'Collect Google Santa logs about process executions on MacOS.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.santaLogs.longDescription', {
      defaultMessage: 'The  module collects and parses logs from [Google Santa](https://github.com/google/santa), \
        a security tool for macOS that monitors process executions and can blacklist/whitelist binaries. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-santa.html'
      }
    }),
    euiIconType: 'logoLogging',
    artifacts: {
      dashboards: [{
        id: '161855f0-ff6a-11e8-93c5-d5ecd1b3e307-ecs',
        linkLabel: _i18n.i18n.translate('home.tutorials.santaLogs.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Santa Overview'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-santa.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/santa_logs/screenshot.png',
    onPrem: (0, _filebeat_instructions.onPremInstructions)(moduleName, platforms, context),
    elasticCloud: (0, _filebeat_instructions.cloudInstructions)(moduleName, platforms),
    onPremElasticCloud: (0, _filebeat_instructions.onPremCloudInstructions)(moduleName, platforms)
  };
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mispLogsSpecProvider = mispLogsSpecProvider;

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
function mispLogsSpecProvider(context) {
  const moduleName = 'misp';
  const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
  return {
    id: 'mispLogs',
    name: _i18n.i18n.translate('home.tutorials.mispLogs.nameTitle', {
      defaultMessage: 'MISP threat intel logs'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.SECURITY_SOLUTION,
    shortDescription: _i18n.i18n.translate('home.tutorials.mispLogs.shortDescription', {
      defaultMessage: 'Collect MISP threat intelligence data with Filebeat.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.mispLogs.longDescription', {
      defaultMessage: 'This is a filebeat module for reading threat intel information from the MISP platform ( https://www.circl.lu/doc/misp/). It uses the httpjson input to access the MISP REST API interface. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-misp.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/misp.svg',
    artifacts: {
      dashboards: [{
        id: 'c6cac9e0-f105-11e9-9a88-690b10c8ee99',
        linkLabel: _i18n.i18n.translate('home.tutorials.mispLogs.artifacts.dashboards.linkLabel', {
          defaultMessage: 'MISP Overview'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-misp.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/misp_logs/screenshot.png',
    onPrem: (0, _filebeat_instructions.onPremInstructions)(moduleName, platforms, context),
    elasticCloud: (0, _filebeat_instructions.cloudInstructions)(moduleName, platforms),
    onPremElasticCloud: (0, _filebeat_instructions.onPremCloudInstructions)(moduleName, platforms)
  };
}
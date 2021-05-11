"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traefikLogsSpecProvider = traefikLogsSpecProvider;

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
function traefikLogsSpecProvider(context) {
  const moduleName = 'traefik';
  const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
  return {
    id: 'traefikLogs',
    name: _i18n.i18n.translate('home.tutorials.traefikLogs.nameTitle', {
      defaultMessage: 'Traefik logs'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.SECURITY_SOLUTION,
    shortDescription: _i18n.i18n.translate('home.tutorials.traefikLogs.shortDescription', {
      defaultMessage: 'Collect Traefik access logs.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.traefikLogs.longDescription', {
      defaultMessage: 'The  module parses access logs created by [Træfik](https://traefik.io/). \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-traefik.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/traefik.svg',
    artifacts: {
      dashboards: [{
        id: 'Filebeat-Traefik-Dashboard-ecs',
        linkLabel: _i18n.i18n.translate('home.tutorials.traefikLogs.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Traefik Access Logs'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-traefik.html'
      }
    },
    completionTimeMinutes: 10,
    onPrem: (0, _filebeat_instructions.onPremInstructions)(moduleName, platforms, context),
    elasticCloud: (0, _filebeat_instructions.cloudInstructions)(moduleName, platforms),
    onPremElasticCloud: (0, _filebeat_instructions.onPremCloudInstructions)(moduleName, platforms)
  };
}
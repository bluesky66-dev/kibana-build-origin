"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nginxLogsSpecProvider = nginxLogsSpecProvider;

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
function nginxLogsSpecProvider(context) {
  const moduleName = 'nginx';
  const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
  return {
    id: 'nginxLogs',
    name: _i18n.i18n.translate('home.tutorials.nginxLogs.nameTitle', {
      defaultMessage: 'Nginx logs'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.LOGGING,
    shortDescription: _i18n.i18n.translate('home.tutorials.nginxLogs.shortDescription', {
      defaultMessage: 'Collect and parse access and error logs created by the Nginx HTTP server.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.nginxLogs.longDescription', {
      defaultMessage: 'The `nginx` Filebeat module parses access and error logs created by the Nginx HTTP server. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-nginx.html'
      }
    }),
    euiIconType: 'logoNginx',
    artifacts: {
      dashboards: [{
        id: '55a9e6e0-a29e-11e7-928f-5dbe6f6f5519-ecs',
        linkLabel: _i18n.i18n.translate('home.tutorials.nginxLogs.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Nginx logs dashboard'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-nginx.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/nginx_logs/screenshot.png',
    onPrem: (0, _filebeat_instructions.onPremInstructions)(moduleName, platforms, context),
    elasticCloud: (0, _filebeat_instructions.cloudInstructions)(moduleName, platforms),
    onPremElasticCloud: (0, _filebeat_instructions.onPremCloudInstructions)(moduleName, platforms)
  };
}
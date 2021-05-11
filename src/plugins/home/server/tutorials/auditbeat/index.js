"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.auditbeatSpecProvider = auditbeatSpecProvider;

var _i18n = require("@kbn/i18n");

var _tutorials = require("../../services/tutorials");

var _auditbeat_instructions = require("../instructions/auditbeat_instructions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function auditbeatSpecProvider(context) {
  const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
  const moduleName = 'auditbeat';
  return {
    id: 'auditbeat',
    name: _i18n.i18n.translate('home.tutorials.auditbeat.nameTitle', {
      defaultMessage: 'Auditbeat'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.SECURITY_SOLUTION,
    shortDescription: _i18n.i18n.translate('home.tutorials.auditbeat.shortDescription', {
      defaultMessage: 'Collect audit data from your hosts.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.auditbeat.longDescription', {
      defaultMessage: 'Use Auditbeat to collect auditing data from your hosts. These include \
processes, users, logins, sockets information, file accesses, and more. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.auditbeat}/auditbeat-overview.html'
      }
    }),
    euiIconType: 'securityAnalyticsApp',
    artifacts: {
      dashboards: [],
      application: {
        path: '/app/security',
        label: _i18n.i18n.translate('home.tutorials.auditbeat.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Security App'
        })
      },
      exportedFields: {
        documentationUrl: '{config.docs.beats.auditbeat}/exported-fields.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/auditbeat/screenshot.png',
    onPrem: (0, _auditbeat_instructions.onPremInstructions)(platforms, context),
    elasticCloud: (0, _auditbeat_instructions.cloudInstructions)(platforms),
    onPremElasticCloud: (0, _auditbeat_instructions.onPremCloudInstructions)(platforms)
  };
}
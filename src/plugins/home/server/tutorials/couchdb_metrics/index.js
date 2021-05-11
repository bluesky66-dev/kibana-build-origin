"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.couchdbMetricsSpecProvider = couchdbMetricsSpecProvider;

var _i18n = require("@kbn/i18n");

var _tutorials = require("../../services/tutorials");

var _metricbeat_instructions = require("../instructions/metricbeat_instructions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function couchdbMetricsSpecProvider(context) {
  const moduleName = 'couchdb';
  return {
    id: 'couchdbMetrics',
    name: _i18n.i18n.translate('home.tutorials.couchdbMetrics.nameTitle', {
      defaultMessage: 'CouchDB metrics'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.METRICS,
    shortDescription: _i18n.i18n.translate('home.tutorials.couchdbMetrics.shortDescription', {
      defaultMessage: 'Fetch monitoring metrics from the CouchdB server.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.couchdbMetrics.longDescription', {
      defaultMessage: 'The `couchdb` Metricbeat module fetches monitoring metrics from CouchDB. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-couchdb.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/couchdb.svg',
    artifacts: {
      dashboards: [{
        id: '496910f0-b952-11e9-a579-f5c0a5d81340',
        linkLabel: _i18n.i18n.translate('home.tutorials.couchdbMetrics.artifacts.dashboards.linkLabel', {
          defaultMessage: 'CouchDB metrics dashboard'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-couchdb.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/couchdb_metrics/screenshot.png',
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName)
  };
}
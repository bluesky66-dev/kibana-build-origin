"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFeaturesUsage = registerFeaturesUsage;
exports.notifyFeatureUsage = notifyFeatureUsage;
exports.features = exports.APM_FEATURE = void 0;

var _i18n = require("@kbn/i18n");

var _alert_types = require("../common/alert_types");

var _server = require("../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const APM_FEATURE = {
  id: 'apm',
  name: _i18n.i18n.translate('xpack.apm.featureRegistry.apmFeatureName', {
    defaultMessage: 'APM and User Experience'
  }),
  order: 900,
  category: _server.DEFAULT_APP_CATEGORIES.observability,
  app: ['apm', 'ux', 'kibana'],
  catalogue: ['apm'],
  management: {
    insightsAndAlerting: ['triggersActions']
  },
  alerting: Object.values(_alert_types.AlertType),
  // see x-pack/plugins/features/common/feature_kibana_privileges.ts
  privileges: {
    all: {
      app: ['apm', 'ux', 'kibana'],
      api: ['apm', 'apm_write'],
      catalogue: ['apm'],
      savedObject: {
        all: [],
        read: []
      },
      alerting: {
        all: Object.values(_alert_types.AlertType)
      },
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      ui: ['show', 'save', 'alerting:show', 'alerting:save']
    },
    read: {
      app: ['apm', 'ux', 'kibana'],
      api: ['apm'],
      catalogue: ['apm'],
      savedObject: {
        all: [],
        read: []
      },
      alerting: {
        read: Object.values(_alert_types.AlertType)
      },
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      ui: ['show', 'alerting:show', 'alerting:save']
    }
  }
};
exports.APM_FEATURE = APM_FEATURE;
const features = {
  serviceMaps: {
    name: 'APM service maps',
    license: 'platinum'
  },
  ml: {
    name: 'APM machine learning',
    license: 'platinum'
  },
  customLinks: {
    name: 'APM custom links',
    license: 'gold'
  }
};
exports.features = features;

function registerFeaturesUsage({
  licensingPlugin
}) {
  Object.values(features).forEach(({
    name,
    license
  }) => {
    licensingPlugin.featureUsage.register(name, license);
  });
}

function notifyFeatureUsage({
  licensingPlugin,
  featureName
}) {
  const feature = features[featureName];
  licensingPlugin.featureUsage.notifyUsage(feature.name);
}
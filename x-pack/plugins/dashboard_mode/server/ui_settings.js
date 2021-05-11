"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettings = getUiSettings;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DASHBOARD_ONLY_USER_ROLE = 'kibana_dashboard_only_user';

function getUiSettings() {
  return {
    [_common.UI_SETTINGS.CONFIG_DASHBOARD_ONLY_MODE_ROLES]: {
      name: _i18n.i18n.translate('xpack.dashboardMode.uiSettings.dashboardsOnlyRolesTitle', {
        defaultMessage: 'Dashboards only roles'
      }),
      description: _i18n.i18n.translate('xpack.dashboardMode.uiSettings.dashboardsOnlyRolesDescription', {
        defaultMessage: 'Roles that belong to View Dashboards Only mode'
      }),
      value: [DASHBOARD_ONLY_USER_ROLE],
      category: ['dashboard'],
      sensitive: true,
      deprecation: {
        message: _i18n.i18n.translate('xpack.dashboardMode.uiSettings.dashboardsOnlyRolesDeprecation', {
          defaultMessage: 'This setting is deprecated and will be removed in Kibana 8.0.'
        }),
        docLinksKey: 'dashboardSettings'
      },
      schema: _configSchema.schema.arrayOf(_configSchema.schema.string())
    }
  };
}
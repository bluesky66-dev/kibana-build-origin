"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateLegacyStatus = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _std = require("@kbn/std");

var _types = require("./types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const calculateLegacyStatus = ({
  core,
  overall,
  plugins,
  versionWithoutSnapshot
}) => {
  const since = new Date().toISOString();
  const overallLegacy = {
    since,
    ...(0, _lodash.pick)(STATUS_LEVEL_LEGACY_ATTRS[overall.level.toString()], ['state', 'title', 'nickname', 'icon', 'uiColor'])
  };
  const coreStatuses = Object.entries(core).map(([serviceName, s]) => serviceStatusToHttpComponent(`core:${serviceName}@${versionWithoutSnapshot}`, s, since));
  const pluginStatuses = Object.entries(plugins).map(([pluginName, s]) => serviceStatusToHttpComponent(`plugin:${pluginName}@${versionWithoutSnapshot}`, s, since));
  const componentStatuses = [...coreStatuses, ...pluginStatuses];
  return {
    overall: overallLegacy,
    statuses: componentStatuses
  };
};

exports.calculateLegacyStatus = calculateLegacyStatus;

const serviceStatusToHttpComponent = (serviceName, status, since) => ({
  id: serviceName,
  message: status.summary,
  since,
  ...serviceStatusAttrs(status)
});

const serviceStatusAttrs = status => (0, _lodash.pick)(STATUS_LEVEL_LEGACY_ATTRS[status.level.toString()], ['state', 'icon', 'uiColor']);

const STATUS_LEVEL_LEGACY_ATTRS = (0, _std.deepFreeze)({
  [_types.ServiceStatusLevels.critical.toString()]: {
    id: 'red',
    state: 'red',
    title: _i18n.i18n.translate('core.status.redTitle', {
      defaultMessage: 'Red'
    }),
    icon: 'danger',
    uiColor: 'danger',
    nickname: 'Danger Will Robinson! Danger!'
  },
  [_types.ServiceStatusLevels.unavailable.toString()]: {
    id: 'red',
    state: 'red',
    title: _i18n.i18n.translate('core.status.redTitle', {
      defaultMessage: 'Red'
    }),
    icon: 'danger',
    uiColor: 'danger',
    nickname: 'Danger Will Robinson! Danger!'
  },
  [_types.ServiceStatusLevels.degraded.toString()]: {
    id: 'yellow',
    state: 'yellow',
    title: _i18n.i18n.translate('core.status.yellowTitle', {
      defaultMessage: 'Yellow'
    }),
    icon: 'warning',
    uiColor: 'warning',
    nickname: "I'll be back"
  },
  [_types.ServiceStatusLevels.available.toString()]: {
    id: 'green',
    state: 'green',
    title: _i18n.i18n.translate('core.status.greenTitle', {
      defaultMessage: 'Green'
    }),
    icon: 'success',
    uiColor: 'secondary',
    nickname: 'Looking good'
  }
});
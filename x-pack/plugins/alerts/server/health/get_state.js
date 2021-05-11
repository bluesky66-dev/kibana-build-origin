"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHealthStatusStream = void 0;

var _i18n = require("@kbn/i18n");

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _server = require("../../../../../src/core/server");

var _task = require("./task");

var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getLatestTaskState(taskManager) {
  try {
    const result = await taskManager.get(_task.HEALTH_TASK_ID);
    return result;
  } catch (err) {
    const errMessage = err && err.message ? err.message : err.toString();

    if (!errMessage.includes('NotInitialized')) {
      throw err;
    }
  }

  return null;
}

const LEVEL_SUMMARY = {
  [_server.ServiceStatusLevels.available.toString()]: _i18n.i18n.translate('xpack.alerts.server.healthStatus.available', {
    defaultMessage: 'Alerting framework is available'
  }),
  [_server.ServiceStatusLevels.degraded.toString()]: _i18n.i18n.translate('xpack.alerts.server.healthStatus.degraded', {
    defaultMessage: 'Alerting framework is degraded'
  }),
  [_server.ServiceStatusLevels.unavailable.toString()]: _i18n.i18n.translate('xpack.alerts.server.healthStatus.unavailable', {
    defaultMessage: 'Alerting framework is unavailable'
  })
};

const getHealthStatusStream = taskManager => {
  return (0, _rxjs.interval)(60000 * 5).pipe((0, _operators.switchMap)(async () => {
    var _doc$state, _doc$state2;

    const doc = await getLatestTaskState(taskManager);
    const level = (doc === null || doc === void 0 ? void 0 : (_doc$state = doc.state) === null || _doc$state === void 0 ? void 0 : _doc$state.health_status) === _types.HealthStatus.OK ? _server.ServiceStatusLevels.available : (doc === null || doc === void 0 ? void 0 : (_doc$state2 = doc.state) === null || _doc$state2 === void 0 ? void 0 : _doc$state2.health_status) === _types.HealthStatus.Warning ? _server.ServiceStatusLevels.degraded : _server.ServiceStatusLevels.unavailable;
    return {
      level,
      summary: LEVEL_SUMMARY[level.toString()]
    };
  }), (0, _operators.catchError)(async error => ({
    level: _server.ServiceStatusLevels.unavailable,
    summary: LEVEL_SUMMARY[_server.ServiceStatusLevels.unavailable.toString()],
    meta: {
      error
    }
  })));
};

exports.getHealthStatusStream = getHealthStatusStream;
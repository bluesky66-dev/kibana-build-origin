"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ACTION_STATES = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ACTION_STATES = {
  // Action is not being executed because conditions haven't been met
  OK: _i18n.i18n.translate('xpack.watcher.constants.actionStates.okStateText', {
    defaultMessage: 'OK'
  }),
  // Action has been acknowledged by user
  ACKNOWLEDGED: _i18n.i18n.translate('xpack.watcher.constants.actionStates.acknowledgedStateText', {
    defaultMessage: 'Acked'
  }),
  // Action has been throttled (time-based) by the system
  THROTTLED: _i18n.i18n.translate('xpack.watcher.constants.actionStates.throttledStateText', {
    defaultMessage: 'Throttled'
  }),
  // Action has been completed
  FIRING: _i18n.i18n.translate('xpack.watcher.constants.actionStates.firingStateText', {
    defaultMessage: 'Firing'
  }),
  // Action has failed
  ERROR: _i18n.i18n.translate('xpack.watcher.constants.actionStates.errorStateText', {
    defaultMessage: 'Error'
  }),
  // Action has a configuration error
  CONFIG_ERROR: _i18n.i18n.translate('xpack.watcher.constants.actionStates.configErrorStateText', {
    defaultMessage: 'Config error'
  }),
  // Action status is unknown; we should never end up in this state
  UNKNOWN: _i18n.i18n.translate('xpack.watcher.constants.actionStates.unknownStateText', {
    defaultMessage: 'Unknown'
  })
};
exports.ACTION_STATES = ACTION_STATES;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WATCH_STATES = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const WATCH_STATES = {
  DISABLED: _i18n.i18n.translate('xpack.watcher.constants.watchStates.disabledStateText', {
    defaultMessage: 'Disabled'
  }),
  OK: _i18n.i18n.translate('xpack.watcher.constants.watchStates.okStateText', {
    defaultMessage: 'OK'
  }),
  FIRING: _i18n.i18n.translate('xpack.watcher.constants.watchStates.firingStateText', {
    defaultMessage: 'Firing'
  }),
  ERROR: _i18n.i18n.translate('xpack.watcher.constants.watchStates.errorStateText', {
    defaultMessage: 'Error'
  }),
  CONFIG_ERROR: _i18n.i18n.translate('xpack.watcher.constants.watchStates.configErrorStateText', {
    defaultMessage: 'Config error'
  })
};
exports.WATCH_STATES = WATCH_STATES;
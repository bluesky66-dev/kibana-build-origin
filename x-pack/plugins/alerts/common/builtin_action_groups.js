"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBuiltinActionGroups = getBuiltinActionGroups;
exports.RecoveredActionGroup = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const RecoveredActionGroup = Object.freeze({
  id: 'recovered',
  name: _i18n.i18n.translate('xpack.alerts.builtinActionGroups.recovered', {
    defaultMessage: 'Recovered'
  })
});
exports.RecoveredActionGroup = RecoveredActionGroup;

function getBuiltinActionGroups(customRecoveryGroup) {
  return [customRecoveryGroup !== null && customRecoveryGroup !== void 0 ? customRecoveryGroup : RecoveredActionGroup];
}
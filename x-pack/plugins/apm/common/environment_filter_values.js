"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEnvironmentLabel = getEnvironmentLabel;
exports.getNextEnvironmentUrlParam = getNextEnvironmentUrlParam;
exports.ENVIRONMENT_NOT_DEFINED = exports.ENVIRONMENT_ALL = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ENVIRONMENT_ALL_VALUE = 'ENVIRONMENT_ALL';
const ENVIRONMENT_NOT_DEFINED_VALUE = 'ENVIRONMENT_NOT_DEFINED';
const environmentLabels = {
  [ENVIRONMENT_ALL_VALUE]: _i18n.i18n.translate('xpack.apm.filter.environment.allLabel', {
    defaultMessage: 'All'
  }),
  [ENVIRONMENT_NOT_DEFINED_VALUE]: _i18n.i18n.translate('xpack.apm.filter.environment.notDefinedLabel', {
    defaultMessage: 'Not defined'
  })
};
const ENVIRONMENT_ALL = {
  value: ENVIRONMENT_ALL_VALUE,
  text: environmentLabels[ENVIRONMENT_ALL_VALUE]
};
exports.ENVIRONMENT_ALL = ENVIRONMENT_ALL;
const ENVIRONMENT_NOT_DEFINED = {
  value: ENVIRONMENT_NOT_DEFINED_VALUE,
  text: environmentLabels[ENVIRONMENT_NOT_DEFINED_VALUE]
};
exports.ENVIRONMENT_NOT_DEFINED = ENVIRONMENT_NOT_DEFINED;

function getEnvironmentLabel(environment) {
  return environmentLabels[environment] || environment;
} // returns the environment url param that should be used
// based on the requested environment. If the requested
// environment is different from the URL parameter, we'll
// return ENVIRONMENT_ALL. If it's not, we'll just return
// the current environment URL param


function getNextEnvironmentUrlParam({
  requestedEnvironment,
  currentEnvironmentUrlParam
}) {
  const normalizedRequestedEnvironment = requestedEnvironment || ENVIRONMENT_NOT_DEFINED.value;
  const normalizedQueryEnvironment = currentEnvironmentUrlParam || ENVIRONMENT_ALL.value;

  if (normalizedRequestedEnvironment === normalizedQueryEnvironment) {
    return currentEnvironmentUrlParam;
  }

  return ENVIRONMENT_ALL.value;
}
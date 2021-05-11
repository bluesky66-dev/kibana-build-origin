"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALLOWED_HOSTS_ERROR = exports.SERVICENOW_SIR = exports.SERVICENOW_ITSM = exports.SERVICENOW = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SERVICENOW = _i18n.i18n.translate('xpack.actions.builtin.serviceNowTitle', {
  defaultMessage: 'ServiceNow'
});

exports.SERVICENOW = SERVICENOW;

const SERVICENOW_ITSM = _i18n.i18n.translate('xpack.actions.builtin.serviceNowITSMTitle', {
  defaultMessage: 'ServiceNow ITSM'
});

exports.SERVICENOW_ITSM = SERVICENOW_ITSM;

const SERVICENOW_SIR = _i18n.i18n.translate('xpack.actions.builtin.serviceNowSIRTitle', {
  defaultMessage: 'ServiceNow SecOps'
});

exports.SERVICENOW_SIR = SERVICENOW_SIR;

const ALLOWED_HOSTS_ERROR = message => _i18n.i18n.translate('xpack.actions.builtin.configuration.apiAllowedHostsError', {
  defaultMessage: 'error configuring connector action: {message}',
  values: {
    message
  }
});

exports.ALLOWED_HOSTS_ERROR = ALLOWED_HOSTS_ERROR;
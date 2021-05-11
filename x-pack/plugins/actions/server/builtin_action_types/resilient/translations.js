"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALLOWED_HOSTS_ERROR = exports.NAME = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const NAME = _i18n.i18n.translate('xpack.actions.builtin.case.resilientTitle', {
  defaultMessage: 'IBM Resilient'
});

exports.NAME = NAME;

const ALLOWED_HOSTS_ERROR = message => _i18n.i18n.translate('xpack.actions.builtin.configuration.apiAllowedHostsError', {
  defaultMessage: 'error configuring connector action: {message}',
  values: {
    message
  }
});

exports.ALLOWED_HOSTS_ERROR = ALLOWED_HOSTS_ERROR;
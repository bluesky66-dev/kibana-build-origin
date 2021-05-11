"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOptionLabel = getOptionLabel;
exports.omitAllOption = omitAllOption;
exports.ALL_OPTION_VALUE = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ALL_OPTION_VALUE = 'ALL_OPTION_VALUE'; // human-readable label for service and environment. The "All" option should be translated.
// Everything else should be returned verbatim

exports.ALL_OPTION_VALUE = ALL_OPTION_VALUE;

function getOptionLabel(value) {
  if (value === undefined || value === ALL_OPTION_VALUE) {
    return _i18n.i18n.translate('xpack.apm.agentConfig.allOptionLabel', {
      defaultMessage: 'All'
    });
  }

  return value;
}

function omitAllOption(value) {
  return value === ALL_OPTION_VALUE ? undefined : value;
}
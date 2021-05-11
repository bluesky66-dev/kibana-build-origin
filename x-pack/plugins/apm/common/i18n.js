"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNIDENTIFIED_SERVICE_NODES_LABEL = exports.NOT_AVAILABLE_LABEL = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const NOT_AVAILABLE_LABEL = _i18n.i18n.translate('xpack.apm.notAvailableLabel', {
  defaultMessage: 'N/A'
});

exports.NOT_AVAILABLE_LABEL = NOT_AVAILABLE_LABEL;

const UNIDENTIFIED_SERVICE_NODES_LABEL = _i18n.i18n.translate('xpack.apm.serviceNodeNameMissing', {
  defaultMessage: '(Empty)'
});

exports.UNIDENTIFIED_SERVICE_NODES_LABEL = UNIDENTIFIED_SERVICE_NODES_LABEL;
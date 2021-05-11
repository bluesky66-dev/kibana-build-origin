"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MonitorStatusTranslations = exports.VALUE_MUST_BE_AN_INTEGER = exports.VALUE_MUST_BE_GREATER_THAN_ZERO = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const VALUE_MUST_BE_GREATER_THAN_ZERO = _i18n.i18n.translate('xpack.uptime.settings.invalid.error', {
  defaultMessage: 'Value must be greater than 0.'
});

exports.VALUE_MUST_BE_GREATER_THAN_ZERO = VALUE_MUST_BE_GREATER_THAN_ZERO;

const VALUE_MUST_BE_AN_INTEGER = _i18n.i18n.translate('xpack.uptime.settings.invalid.nanError', {
  defaultMessage: 'Value must be an integer.'
});

exports.VALUE_MUST_BE_AN_INTEGER = VALUE_MUST_BE_AN_INTEGER;
const MonitorStatusTranslations = {
  defaultActionMessage: _i18n.i18n.translate('xpack.uptime.alerts.monitorStatus.defaultActionMessage', {
    defaultMessage: 'Monitor {monitorName} with url {monitorUrl} is {statusMessage} from {observerLocation}. The latest error message is {latestErrorMessage}',
    values: {
      monitorName: '{{state.monitorName}}',
      monitorUrl: '{{{state.monitorUrl}}}',
      statusMessage: '{{state.statusMessage}}',
      latestErrorMessage: '{{{state.latestErrorMessage}}}',
      observerLocation: '{{state.observerLocation}}'
    }
  }),
  name: _i18n.i18n.translate('xpack.uptime.alerts.monitorStatus.clientName', {
    defaultMessage: 'Uptime monitor status'
  }),
  description: _i18n.i18n.translate('xpack.uptime.alerts.monitorStatus.description', {
    defaultMessage: 'Alert when a monitor is down or an availability threshold is breached.'
  })
};
exports.MonitorStatusTranslations = MonitorStatusTranslations;
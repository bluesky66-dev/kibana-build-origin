"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceHealthStatus = getServiceHealthStatus;
exports.getServiceHealthStatusColor = getServiceHealthStatusColor;
exports.getServiceHealthStatusBadgeColor = getServiceHealthStatusBadgeColor;
exports.getServiceHealthStatusLabel = getServiceHealthStatusLabel;
exports.ServiceHealthStatus = void 0;

var _i18n = require("@kbn/i18n");

var _common = require("../../ml/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let ServiceHealthStatus;
exports.ServiceHealthStatus = ServiceHealthStatus;

(function (ServiceHealthStatus) {
  ServiceHealthStatus["healthy"] = "healthy";
  ServiceHealthStatus["critical"] = "critical";
  ServiceHealthStatus["warning"] = "warning";
  ServiceHealthStatus["unknown"] = "unknown";
})(ServiceHealthStatus || (exports.ServiceHealthStatus = ServiceHealthStatus = {}));

function getServiceHealthStatus({
  severity
}) {
  switch (severity) {
    case _common.ANOMALY_SEVERITY.CRITICAL:
    case _common.ANOMALY_SEVERITY.MAJOR:
      return ServiceHealthStatus.critical;

    case _common.ANOMALY_SEVERITY.MINOR:
    case _common.ANOMALY_SEVERITY.WARNING:
      return ServiceHealthStatus.warning;

    case _common.ANOMALY_SEVERITY.LOW:
      return ServiceHealthStatus.healthy;

    case _common.ANOMALY_SEVERITY.UNKNOWN:
      return ServiceHealthStatus.unknown;
  }
}

function getServiceHealthStatusColor(theme, status) {
  switch (status) {
    case ServiceHealthStatus.healthy:
      return theme.eui.euiColorVis0;

    case ServiceHealthStatus.warning:
      return theme.eui.euiColorVis5;

    case ServiceHealthStatus.critical:
      return theme.eui.euiColorVis9;

    case ServiceHealthStatus.unknown:
      return theme.eui.euiColorMediumShade;
  }
}

function getServiceHealthStatusBadgeColor(theme, status) {
  switch (status) {
    case ServiceHealthStatus.healthy:
      return theme.eui.euiColorVis0_behindText;

    case ServiceHealthStatus.warning:
      return theme.eui.euiColorVis5_behindText;

    case ServiceHealthStatus.critical:
      return theme.eui.euiColorVis9_behindText;

    case ServiceHealthStatus.unknown:
      return theme.eui.euiColorMediumShade;
  }
}

function getServiceHealthStatusLabel(status) {
  switch (status) {
    case ServiceHealthStatus.critical:
      return _i18n.i18n.translate('xpack.apm.serviceHealthStatus.critical', {
        defaultMessage: 'Critical'
      });

    case ServiceHealthStatus.warning:
      return _i18n.i18n.translate('xpack.apm.serviceHealthStatus.warning', {
        defaultMessage: 'Warning'
      });

    case ServiceHealthStatus.healthy:
      return _i18n.i18n.translate('xpack.apm.serviceHealthStatus.healthy', {
        defaultMessage: 'Healthy'
      });

    case ServiceHealthStatus.unknown:
      return _i18n.i18n.translate('xpack.apm.serviceHealthStatus.unknown', {
        defaultMessage: 'Unknown'
      });
  }
}
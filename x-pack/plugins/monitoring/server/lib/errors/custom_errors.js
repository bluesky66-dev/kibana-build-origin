"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MonitoringLicenseError = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class MonitoringLicenseError extends Error {
  constructor(clusterId) {
    super();
    this.message = _i18n.i18n.translate('xpack.monitoring.errors.monitoringLicenseErrorTitle', {
      defaultMessage: 'Monitoring License Error'
    });
    this.description = _i18n.i18n.translate('xpack.monitoring.errors.monitoringLicenseErrorDescription', {
      defaultMessage: "Could not find license information for cluster = '{clusterId}'. " + "Please check the cluster's master node server logs for errors or warnings.",
      values: {
        clusterId
      }
    });
  }

}

exports.MonitoringLicenseError = MonitoringLicenseError;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ANOMALY_ALERT_SEVERITY_TYPES = exports.ALERT_TYPES_CONFIG = exports.THRESHOLD_MET_GROUP_ID = exports.AlertType = void 0;

var _i18n = require("@kbn/i18n");

var _common = require("../../ml/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let AlertType;
exports.AlertType = AlertType;

(function (AlertType) {
  AlertType["ErrorCount"] = "apm.error_rate";
  AlertType["TransactionErrorRate"] = "apm.transaction_error_rate";
  AlertType["TransactionDuration"] = "apm.transaction_duration";
  AlertType["TransactionDurationAnomaly"] = "apm.transaction_duration_anomaly";
})(AlertType || (exports.AlertType = AlertType = {}));

const THRESHOLD_MET_GROUP_ID = 'threshold_met';
exports.THRESHOLD_MET_GROUP_ID = THRESHOLD_MET_GROUP_ID;
const THRESHOLD_MET_GROUP = {
  id: THRESHOLD_MET_GROUP_ID,
  name: _i18n.i18n.translate('xpack.apm.a.thresholdMet', {
    defaultMessage: 'Threshold met'
  })
};
const ALERT_TYPES_CONFIG = {
  [AlertType.ErrorCount]: {
    name: _i18n.i18n.translate('xpack.apm.errorCountAlert.name', {
      defaultMessage: 'Error count threshold'
    }),
    actionGroups: [THRESHOLD_MET_GROUP],
    defaultActionGroupId: THRESHOLD_MET_GROUP_ID,
    minimumLicenseRequired: 'basic',
    producer: 'apm'
  },
  [AlertType.TransactionDuration]: {
    name: _i18n.i18n.translate('xpack.apm.transactionDurationAlert.name', {
      defaultMessage: 'Latency threshold'
    }),
    actionGroups: [THRESHOLD_MET_GROUP],
    defaultActionGroupId: THRESHOLD_MET_GROUP_ID,
    minimumLicenseRequired: 'basic',
    producer: 'apm'
  },
  [AlertType.TransactionDurationAnomaly]: {
    name: _i18n.i18n.translate('xpack.apm.transactionDurationAnomalyAlert.name', {
      defaultMessage: 'Latency anomaly'
    }),
    actionGroups: [THRESHOLD_MET_GROUP],
    defaultActionGroupId: THRESHOLD_MET_GROUP_ID,
    minimumLicenseRequired: 'basic',
    producer: 'apm'
  },
  [AlertType.TransactionErrorRate]: {
    name: _i18n.i18n.translate('xpack.apm.transactionErrorRateAlert.name', {
      defaultMessage: 'Transaction error rate threshold'
    }),
    actionGroups: [THRESHOLD_MET_GROUP],
    defaultActionGroupId: THRESHOLD_MET_GROUP_ID,
    minimumLicenseRequired: 'basic',
    producer: 'apm'
  }
};
exports.ALERT_TYPES_CONFIG = ALERT_TYPES_CONFIG;
const ANOMALY_ALERT_SEVERITY_TYPES = [{
  type: _common.ANOMALY_SEVERITY.CRITICAL,
  label: _i18n.i18n.translate('xpack.apm.alerts.anomalySeverity.criticalLabel', {
    defaultMessage: 'critical'
  }),
  threshold: _common.ANOMALY_THRESHOLD.CRITICAL
}, {
  type: _common.ANOMALY_SEVERITY.MAJOR,
  label: _i18n.i18n.translate('xpack.apm.alerts.anomalySeverity.majorLabel', {
    defaultMessage: 'major'
  }),
  threshold: _common.ANOMALY_THRESHOLD.MAJOR
}, {
  type: _common.ANOMALY_SEVERITY.MINOR,
  label: _i18n.i18n.translate('xpack.apm.alerts.anomalySeverity.minor', {
    defaultMessage: 'minor'
  }),
  threshold: _common.ANOMALY_THRESHOLD.MINOR
}, {
  type: _common.ANOMALY_SEVERITY.WARNING,
  label: _i18n.i18n.translate('xpack.apm.alerts.anomalySeverity.warningLabel', {
    defaultMessage: 'warning'
  }),
  threshold: _common.ANOMALY_THRESHOLD.WARNING
}]; // Server side registrations
// x-pack/plugins/apm/server/lib/alerts/<alert>.ts
// x-pack/plugins/apm/server/lib/alerts/register_apm_alerts.ts
// Client side registrations:
// x-pack/plugins/apm/public/components/alerting/<alert>/index.tsx
// x-pack/plugins/apm/public/components/alerting/register_apm_alerts

exports.ANOMALY_ALERT_SEVERITY_TYPES = ANOMALY_ALERT_SEVERITY_TYPES;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAnomalyDetectionAlertType = registerAnomalyDetectionAlertType;

var _i18n = require("@kbn/i18n");

var _alerts = require("../../../common/constants/alerts");

var _app = require("../../../common/constants/app");

var _license = require("../../../common/license");

var _alerting_schema = require("../../routes/schemas/alerting_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const alertTypeConfig = _alerts.ML_ALERT_TYPES_CONFIG[_alerts.ML_ALERT_TYPES.ANOMALY_DETECTION];

function registerAnomalyDetectionAlertType({
  alerts,
  mlSharedServices
}) {
  alerts.registerType({
    id: _alerts.ML_ALERT_TYPES.ANOMALY_DETECTION,
    name: alertTypeConfig.name,
    actionGroups: alertTypeConfig.actionGroups,
    defaultActionGroupId: alertTypeConfig.defaultActionGroupId,
    validate: {
      params: _alerting_schema.mlAnomalyDetectionAlertParams
    },
    actionVariables: {
      context: [{
        name: 'timestamp',
        description: _i18n.i18n.translate('xpack.ml.alertContext.timestampDescription', {
          defaultMessage: 'The bucket timestamp of the anomaly'
        })
      }, {
        name: 'timestampIso8601',
        description: _i18n.i18n.translate('xpack.ml.alertContext.timestampIso8601Description', {
          defaultMessage: 'The bucket time of the anomaly in ISO8601 format'
        })
      }, {
        name: 'jobIds',
        description: _i18n.i18n.translate('xpack.ml.alertContext.jobIdsDescription', {
          defaultMessage: 'List of job IDs that triggered the alert instance'
        })
      }, {
        name: 'isInterim',
        description: _i18n.i18n.translate('xpack.ml.alertContext.isInterimDescription', {
          defaultMessage: 'Indicate if top hits contain interim results'
        })
      }, {
        name: 'score',
        description: _i18n.i18n.translate('xpack.ml.alertContext.scoreDescription', {
          defaultMessage: 'Anomaly score at the time of the notification action'
        })
      }, {
        name: 'topRecords',
        description: _i18n.i18n.translate('xpack.ml.alertContext.topRecordsDescription', {
          defaultMessage: 'Top records'
        })
      }, {
        name: 'topInfluencers',
        description: _i18n.i18n.translate('xpack.ml.alertContext.topInfluencersDescription', {
          defaultMessage: 'Top influencers'
        })
      }, {
        name: 'anomalyExplorerUrl',
        description: _i18n.i18n.translate('xpack.ml.alertContext.anomalyExplorerUrlDescription', {
          defaultMessage: 'URL to open in the Anomaly Explorer'
        }),
        useWithTripleBracesInTemplates: true
      }]
    },
    producer: _app.PLUGIN_ID,
    minimumLicenseRequired: _license.MINIMUM_FULL_LICENSE,

    async executor({
      services,
      params,
      alertId,
      state,
      previousStartedAt,
      startedAt
    }) {
      const fakeRequest = {};
      const {
        execute
      } = mlSharedServices.alertingServiceProvider(services.savedObjectsClient, fakeRequest);
      const executionResult = await execute(params, startedAt, previousStartedAt);

      if (executionResult) {
        const alertInstanceName = executionResult.name;
        const alertInstance = services.alertInstanceFactory(alertInstanceName);
        alertInstance.scheduleActions(alertTypeConfig.defaultActionGroupId, executionResult);
      }
    }

  });
}
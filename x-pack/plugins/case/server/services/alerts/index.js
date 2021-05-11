"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertService = void 0;

var _lodash = require("lodash");

var _constants = require("../../../common/constants");

var _error = require("../../common/error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isEmptyAlert(alert) {
  return (0, _lodash.isEmpty)(alert.id) || (0, _lodash.isEmpty)(alert.index);
}

class AlertService {
  constructor() {}

  async updateAlertsStatus({
    alerts,
    scopedClusterClient,
    logger
  }) {
    try {
      const body = alerts.filter(alert => !isEmptyAlert(alert)).flatMap(alert => [{
        update: {
          _id: alert.id,
          _index: alert.index
        }
      }, {
        doc: {
          signal: {
            status: alert.status
          }
        }
      }]);

      if (body.length <= 0) {
        return;
      }

      return scopedClusterClient.bulk({
        body
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to update alert status ids: ${JSON.stringify(alerts)}: ${error}`,
        error,
        logger
      });
    }
  }

  async getAlerts({
    scopedClusterClient,
    alertsInfo,
    logger
  }) {
    try {
      const docs = alertsInfo.filter(alert => !isEmptyAlert(alert)).slice(0, _constants.MAX_ALERTS_PER_SUB_CASE).map(alert => ({
        _id: alert.id,
        _index: alert.index
      }));

      if (docs.length <= 0) {
        return;
      }

      const results = await scopedClusterClient.mget({
        body: {
          docs
        }
      });
      return results.body;
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to retrieve alerts ids: ${JSON.stringify(alertsInfo)}: ${error}`,
        error,
        logger
      });
    }
  }

}

exports.AlertService = AlertService;
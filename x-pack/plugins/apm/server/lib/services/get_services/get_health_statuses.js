"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHealthStatuses = void 0;

var _anomaly_detection = require("../../../../common/anomaly_detection");

var _service_health_status = require("../../../../common/service_health_status");

var _get_service_anomalies = require("../../service_map/get_service_anomalies");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getHealthStatuses = async ({
  environment,
  setup
}) => {
  if (!setup.ml) {
    return [];
  }

  const anomalies = await (0, _get_service_anomalies.getServiceAnomalies)({
    setup,
    environment
  });
  return anomalies.serviceAnomalies.map(anomalyStats => {
    const severity = (0, _anomaly_detection.getSeverity)(anomalyStats.anomalyScore);
    const healthStatus = (0, _service_health_status.getServiceHealthStatus)({
      severity
    });
    return {
      serviceName: anomalyStats.serviceName,
      healthStatus
    };
  });
};

exports.getHealthStatuses = getHealthStatuses;
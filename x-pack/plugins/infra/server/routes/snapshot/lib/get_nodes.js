"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNodes = void 0;

var _transform_request_to_metrics_api_request = require("./transform_request_to_metrics_api_request");

var _query_all_data = require("./query_all_data");

var _trasform_metrics_ui_response = require("./trasform_metrics_ui_response");

var _copy_missing_metrics = require("./copy_missing_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getNodes = async (client, snapshotRequest, source) => {
  const metricsApiRequest = await (0, _transform_request_to_metrics_api_request.transformRequestToMetricsAPIRequest)(client, source, snapshotRequest);
  const metricsApiResponse = await (0, _query_all_data.queryAllData)(client, metricsApiRequest);
  const snapshotResponse = (0, _trasform_metrics_ui_response.transformMetricsApiResponseToSnapshotResponse)(metricsApiRequest, snapshotRequest, source, metricsApiResponse);
  return (0, _copy_missing_metrics.copyMissingMetrics)(snapshotResponse);
};

exports.getNodes = getNodes;
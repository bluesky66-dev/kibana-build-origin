"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendBulkPayload = sendBulkPayload;

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Send the Kibana usage data to the ES Monitoring Bulk endpoint
 */


async function sendBulkPayload(esClient, interval, payload) {
  const {
    body
  } = await esClient.monitoring.bulk({
    system_id: _constants.KIBANA_SYSTEM_ID,
    system_api_version: _constants.MONITORING_SYSTEM_API_VERSION,
    interval: interval + 'ms',
    body: payload
  });
  return body;
}
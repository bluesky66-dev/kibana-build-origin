"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectEvents = selectEvents;
exports.sendAlertTelemetryEvents = sendAlertTelemetryEvents;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function selectEvents(filteredEvents) {
  const sources = filteredEvents.hits.hits.map(function (obj) {
    return obj._source;
  }); // Filter out non-endpoint alerts

  return sources.filter(obj => {
    var _obj$data_stream;

    return ((_obj$data_stream = obj.data_stream) === null || _obj$data_stream === void 0 ? void 0 : _obj$data_stream.dataset) === 'endpoint.alerts';
  });
}

function sendAlertTelemetryEvents(logger, eventsTelemetry, filteredEvents, ruleParams, buildRuleMessage) {
  if (eventsTelemetry === undefined) {
    return;
  }

  const sources = selectEvents(filteredEvents);

  try {
    eventsTelemetry.queueTelemetryEvents(sources);
  } catch (exc) {
    logger.error(buildRuleMessage(`[-] queing telemetry events failed ${exc}`));
  }
}
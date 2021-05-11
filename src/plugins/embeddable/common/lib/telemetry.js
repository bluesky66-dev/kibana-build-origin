"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTelemetryFunction = void 0;

var _migrate_base_input = require("./migrate_base_input");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getTelemetryFunction = embeddables => {
  return (state, telemetryData = {}) => {
    const enhancements = state.enhancements || {};
    const factory = embeddables.getEmbeddableFactory(state.type);
    let outputTelemetryData = (0, _migrate_base_input.telemetryBaseEmbeddableInput)(state, telemetryData);

    if (factory) {
      outputTelemetryData = factory.telemetry(state, outputTelemetryData);
    }

    Object.keys(enhancements).map(key => {
      if (!enhancements[key]) return;
      outputTelemetryData = embeddables.getEnhancement(key).telemetry(enhancements[key], outputTelemetryData);
    });
    return outputTelemetryData;
  };
};

exports.getTelemetryFunction = getTelemetryFunction;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApmTelemetryMapping = getApmTelemetryMapping;
exports.mergeApmTelemetryMapping = mergeApmTelemetryMapping;

var _immer = require("immer");

var _schema = require("../server/lib/apm_telemetry/schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line @kbn/eslint/no-restricted-paths


function schemaToMapping(schemaLeaf) {
  // convert "array" definition to mapping
  if (schemaLeaf.type === 'array') {
    return schemaToMapping(schemaLeaf.items);
  }

  if (typeof schemaLeaf.type === 'string') {
    return schemaLeaf;
  }

  return Object.entries(schemaLeaf).reduce((acc, [key, value]) => {
    const propMapping = schemaToMapping(value);
    return { ...acc,
      [key]: typeof propMapping.type === 'string' ? propMapping : {
        properties: propMapping
      }
    };
  }, {});
}
/**
 * Generate an object containing the mapping used for APM telemetry based on the schema specified
 * in the usage collector. Can be used with the `upload-telemetry-data` script or to update the
 * mapping in the telemetry repository.
 */


function getApmTelemetryMapping() {
  return {
    properties: schemaToMapping(_schema.apmSchema)
  };
}
/**
 * Merge a telemetry mapping object (from https://github.com/elastic/telemetry/blob/master/config/templates/xpack-phone-home.json)
 * with the output from `getApmTelemetryMapping`.
 */


function mergeApmTelemetryMapping(xpackPhoneHomeMapping) {
  return (0, _immer.produce)(xpackPhoneHomeMapping, draft => {
    draft.mappings.properties.stack_stats.properties.kibana.properties.plugins.properties.apm = getApmTelemetryMapping();
    return draft;
  });
}
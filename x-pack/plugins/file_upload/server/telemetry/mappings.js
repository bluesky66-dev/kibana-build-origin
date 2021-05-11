"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telemetryMappingsType = void 0;

var _telemetry = require("./telemetry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const telemetryMappingsType = {
  name: _telemetry.TELEMETRY_DOC_ID,
  hidden: false,
  namespaceType: 'agnostic',
  mappings: {
    properties: {
      file_upload: {
        properties: {
          index_creation_count: {
            type: 'long'
          }
        }
      }
    }
  }
};
exports.telemetryMappingsType = telemetryMappingsType;
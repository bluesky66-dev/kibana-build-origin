"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initFileUploadTelemetry = initFileUploadTelemetry;

var _telemetry = require("./telemetry");

var _mappings = require("./mappings");

var _internal_repository = require("./internal_repository");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initFileUploadTelemetry(coreSetup, usageCollection) {
  coreSetup.savedObjects.registerType(_mappings.telemetryMappingsType);
  registerUsageCollector(usageCollection);
  coreSetup.getStartServices().then(([core]) => {
    (0, _internal_repository.setInternalRepository)(core.savedObjects.createInternalRepository);
  });
}

function registerUsageCollector(usageCollectionSetup) {
  const usageCollector = usageCollectionSetup.makeUsageCollector({
    type: 'fileUpload',
    isReady: () => true,
    schema: {
      file_upload: {
        index_creation_count: {
          type: 'long'
        }
      }
    },
    fetch: async () => {
      const mlUsage = await (0, _telemetry.getTelemetry)();

      if (!mlUsage) {
        return (0, _telemetry.initTelemetry)();
      }

      return mlUsage;
    }
  });
  usageCollectionSetup.registerCollector(usageCollector);
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initTelemetry = initTelemetry;
exports.getTelemetry = getTelemetry;
exports.updateTelemetry = updateTelemetry;
exports.TELEMETRY_DOC_ID = void 0;

var _lodash = require("lodash");

var _internal_repository = require("./internal_repository");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const TELEMETRY_DOC_ID = 'file-upload-usage-collection-telemetry';
exports.TELEMETRY_DOC_ID = TELEMETRY_DOC_ID;

function initTelemetry() {
  return {
    file_upload: {
      index_creation_count: 0
    }
  };
}

async function getTelemetry(internalRepository) {
  if (internalRepository === undefined) {
    return null;
  }

  let telemetrySavedObject;

  try {
    telemetrySavedObject = await internalRepository.get(TELEMETRY_DOC_ID, TELEMETRY_DOC_ID);
  } catch (e) {// Fail silently
  }

  return telemetrySavedObject ? telemetrySavedObject.attributes : null;
}

async function updateTelemetry(internalRepo) {
  const internalRepository = internalRepo || (0, _internal_repository.getInternalRepository)();

  if (internalRepository === null) {
    return;
  }

  let telemetry = await getTelemetry(internalRepository); // Create if doesn't exist

  if (telemetry === null || (0, _lodash.isEmpty)(telemetry)) {
    const newTelemetrySavedObject = await internalRepository.create(TELEMETRY_DOC_ID, initTelemetry(), {
      id: TELEMETRY_DOC_ID
    });
    telemetry = newTelemetrySavedObject.attributes;
  }

  if (telemetry !== null) {
    await internalRepository.update(TELEMETRY_DOC_ID, TELEMETRY_DOC_ID, incrementCounts(telemetry));
  }
}

function incrementCounts(telemetry) {
  return {
    file_upload: {
      index_creation_count: telemetry.file_upload.index_creation_count + 1
    }
  };
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.incrementUICounter = incrementUICounter;
exports.getSavedObjectAttributesFromRepo = void 0;

var _server = require("../../../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// This throws `Error: Cannot find module 'src/core/server'` if I import it via alias ¯\_(ツ)_/¯

/**
 * Fetches saved objects attributes - used by collectors
 */


const getSavedObjectAttributesFromRepo = async (id, savedObjectsRepository, log) => {
  try {
    return (await savedObjectsRepository.get(id, id)).attributes;
  } catch (e) {
    if (!_server.SavedObjectsErrorHelpers.isNotFoundError(e)) {
      log.warn(`Failed to retrieve ${id} telemetry data: ${e}`);
    }

    return null;
  }
};
/**
 * Set saved objection attributes - used by telemetry route
 */


exports.getSavedObjectAttributesFromRepo = getSavedObjectAttributesFromRepo;

async function incrementUICounter({
  id,
  savedObjects,
  uiAction,
  metric
}) {
  const internalRepository = savedObjects.createInternalRepository();
  await internalRepository.incrementCounter(id, id, [`${uiAction}.${metric}`] // e.g., ui_viewed.setup_guide
  );
  return {
    success: true
  };
}
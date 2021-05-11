"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTelemetrySavedObject = updateTelemetrySavedObject;

var _server = require("../../../../core/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function updateTelemetrySavedObject(savedObjectsClient, savedObjectAttributes) {
  try {
    return await savedObjectsClient.update('telemetry', 'telemetry', savedObjectAttributes);
  } catch (err) {
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(err)) {
      return await savedObjectsClient.create('telemetry', savedObjectAttributes, {
        id: 'telemetry',
        overwrite: true
      });
    }

    throw err;
  }
}
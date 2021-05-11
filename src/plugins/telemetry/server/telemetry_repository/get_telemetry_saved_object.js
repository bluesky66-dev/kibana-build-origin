"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTelemetrySavedObject = void 0;

var _server = require("../../../../core/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getTelemetrySavedObject = async (repository) => {
  try {
    const {
      attributes
    } = await repository.get('telemetry', 'telemetry');
    return attributes;
  } catch (error) {
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(error)) {
      return null;
    } // if we aren't allowed to get the telemetry document, we can assume that we won't
    // be able to opt into telemetry either, so we're returning `false` here instead of null


    if (_server.SavedObjectsErrorHelpers.isForbiddenError(error)) {
      return false;
    }

    throw error;
  }
};

exports.getTelemetrySavedObject = getTelemetrySavedObject;